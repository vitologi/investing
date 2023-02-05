import {inject, injectable} from 'inversify';
import {action, computed, makeObservable, observable, when} from 'mobx';
import {ImportFormat} from "../shared/enums/import-format";
import {TransactionsStore} from "./transactions.store";
import {uploadFile} from "../../../shared/utils/upload-file-content";
import {tsv2Json} from "../shared/utils/tsv-2-json";
import {ITransactionDto} from "../shared/dtos/transaction.dto";
import {CurrenciesStore} from "../../currencies/store/currencies.store";
import {PortfoliosStore} from "../../portfolios/store/portfolios.store";
import {ExchangeStore} from "../../exchanges/store/exchange.store";
import {AssetTypesStore} from "../../asset-types/store/asset-types.store";
import ObjectId from "bson-objectid";
import {TransactionType} from "../shared/enums/transaction-type";
import {json2Tsv} from "../shared/utils/json-2-tsv";
import {saveAs} from "file-saver";
import {Portfolio} from "../../portfolios/shared/models/portfolio";
import {AssetType} from "../../asset-types/shared/models/asset-type";
import {OperationType} from "../shared/enums/operation-type";
import {getDefaultOperations} from "../shared/utils/get-default-operations";
import {TickersStore} from "../../tickers/store/tickers.store";
import {Transaction} from "../shared/models/transaction";
import {Ticker} from "../../tickers/shared/models/ticker";

@injectable()
export class TransactionsTransferStore {
  process = 0;

  constructor(
    @inject('TransactionsStore') private transactionsStore: TransactionsStore,
    @inject('CurrenciesStore') private currenciesStore: CurrenciesStore,
    @inject('PortfoliosStore') private portfoliosStore: PortfoliosStore,
    @inject('ExchangeStore') private exchangeStore: ExchangeStore,
    @inject('AssetTypesStore') private assetTypesStore: AssetTypesStore,
    @inject('TickersStore') private tickersStore: TickersStore,
  ) {
    makeObservable(this, {
      process: observable,
      isInProgress: computed,
      exportTransactions: action,
      importTransactions: action,
      clearAllTransactions: action,
      adjustBalance: action,
      setProgress: action,
    });
  }

  get isInProgress(): boolean {
    return this.process > 0 && this.process < 100;
  }

  setProgress(value = 0): void {
    this.process = value;
  }

  async importTransactions(props: { format?: ImportFormat } = {}): Promise<void> {
    const {format = ImportFormat.CSV} = props;
    let text: string;
    const dtos: ITransactionDto[] = [];

    switch (format) {
      case ImportFormat.CSV:
      default:
        text = await uploadFile();
        for (const obj of tsv2Json(text)) {
          dtos.push(await this.validateTransaction(obj));
        }
        break;
    }

    for (const dto of dtos) {
      await this.transactionsStore.create(dto);
    }

    // recalculate tickers
    this.tickersStore.list.forEach((item) => item.init());
  }

  // TODO: need to implement import interface like ITransactionImportDto{...}
  async exportTransactions(props: { format?: ImportFormat } = {}): Promise<void> {
    const {format = ImportFormat.CSV} = props;
    let text: string;
    let portfolioModel: Portfolio;
    let assetTypeModel: AssetType;

    if (!this.transactionsStore.list.length) {
      return;
    }

    switch (format) {
      case ImportFormat.CSV:
      default:
        text = json2Tsv(this.transactionsStore.list.map((item) => {
          let resultPortfolio = '';
          if (item.portfolio) {
            portfolioModel = this.portfoliosStore.item(item.portfolio) || this.portfoliosStore.list[0];
            resultPortfolio = portfolioModel.name;
          }

          let resultAssetType = '';
          if (item.forward && item.forward.assetType) {
            assetTypeModel = this.assetTypesStore.item(item.forward.assetType) || this.assetTypesStore.list[0];
            resultAssetType = assetTypeModel.name;
          }

          return {
            date: item.date.toLocaleDateString('en'), // only ISO date format
            portfolio: resultPortfolio,
            assetType: resultAssetType,
            exchange: item.exchange,
            type: item.type,
            security: item.forward ? item.forward.name : '',
            quantity: item.forward ? item.forward.amount : '',
            currency: item.backward ? item.backward.name : '',
            price: item.backward ? item.backward.amount : '',
            commission: item.commission ? item.commission.amount : '',
          }
        }));
        saveAs(new Blob([text], {type: "text/plain;charset=utf-8"}), "investing.dump.csv");
        break;
    }
  }

  async clearAllTransactions(): Promise<void> {
    const dtos = this.transactionsStore.list.map((item) => item.asDto);
    for (const dto of dtos) {
      await this.transactionsStore.delete(dto);
    }
  }

  async adjustBalance(combineInOne = false): Promise<void> {
    if (this.isInProgress) {
      return;
    }
    this.setProgress(0);

    const transactions = this.transactionsStore.list.concat()
      .filter((item) => [TransactionType.Buy].includes(item.type));
    transactions.sort((a, b) => a.date > b.date ? 1 : -1)
    const lenght = transactions.length;
    const fixTransactionIds: string[] = [];
    const tickers = new Set<Ticker>();

    for (const [index, transaction] of Array.from(transactions.entries())) {
      this.setProgress(Math.ceil(index * 100 / lenght));

      // TODO: need to cache results
      const ticker = this.tickersStore.getTickerByTransaction(transaction, OperationType.Backward);

      if (!ticker || !transaction.backward) {
        continue;
      }
      tickers.add(ticker);

      const availableAmount = ticker.amountOnDate(transaction.date);
      if (transaction.total && availableAmount < 0) {
        const fixTransaction = this.createFixTransaction(transaction);

        // correct by smallest sum
        if (fixTransaction.forward && Math.abs(availableAmount) < Math.abs(transaction.total)) {
          fixTransaction.forward.setAmount(Math.abs(availableAmount));
        }

        const dto = await this.transactionsStore.create(fixTransaction.asDto);
        fixTransactionIds.push(dto._id);
      }
    }

    if (combineInOne) {
      await this.combineInOne(fixTransactionIds);
    }

    Array.from(tickers.values()).forEach((item) => item.init());
    this.setProgress(100);
    return;
  }

  // TODO: apply import interface
  private async validateTransaction(data: { [key: string]: string }): Promise<ITransactionDto> {
    const {
      date, assetType, security, type, quantity,
      price, commission: commissionOrTax, currency, portfolio, exchange
    } = data;

    await when(() => this.assetTypesStore.list.length > 0);
    await when(() => this.portfoliosStore.list.length > 0);
    await when(() => this.exchangeStore.list.length > 0);
    await when(() => this.currenciesStore.list.length > 0);

    const _id = new ObjectId().toHexString();
    const resultDate = new Date(date).getTime();

    let resultExchange = null;
    let resultSecurity
    if (security) {
      if (security.includes('.')) {
        const [sec, exch] = security.split('.');
        resultSecurity = sec;
        resultExchange = this.exchangeStore.getExchangeBySuffix('.' + exch);
      } else {
        resultSecurity = security;
      }
    } else {
      resultSecurity = '-';
    }

    let resultAssetType = '';
    if (assetType) {
      const assetTypeModel = this.assetTypesStore.list.find((item) => item.name === assetType);
      if (assetTypeModel) {
        resultAssetType = assetTypeModel.id;
      } else {
        const newModel = await this.assetTypesStore.createEmpty();
        newModel.name = assetType;
        resultAssetType = (await this.assetTypesStore.create(newModel.asDto))._id;
      }
    } else {
      resultAssetType = this.assetTypesStore.list[0].id;
    }

    let resultPortfolio = '';
    if (portfolio) {
      const portfolioModel = this.portfoliosStore.list.find((item) => item.name === portfolio);
      if (portfolioModel) {
        resultPortfolio = portfolioModel.id;
      } else {
        const newModel = await this.portfoliosStore.createEmpty();
        newModel.name = portfolio;
        resultPortfolio = (await this.portfoliosStore.create(newModel.asDto))._id;
      }
    } else {
      resultPortfolio = this.portfoliosStore.list[0].id;
    }

    if (exchange) {
      const exchangeId = this.exchangeStore.getExchangeByMic(exchange);
      if (!exchangeId) {
        alert(`Exchange ${exchange} hadn't been found in system.`)
      }
      resultExchange = exchange;
    }


    const resultQuantity = quantity ? parseFloat(quantity.replaceAll(",", "")) : 0;
    const resultPrice = price ? parseFloat(price.replaceAll(",", "")) : 0;
    const resultCommissionOrTax = commissionOrTax ? parseFloat(commissionOrTax.replaceAll(",", "")) : 0;
    const resultType = (
      type && Object.values(TransactionType).includes(type as TransactionType)
    ) ? type as TransactionType : TransactionType.Deposit;

    // TODO: need to set assertion
    const resultCurrency = currency || this.currenciesStore.enabledList[0].code;


    const result: ITransactionDto = {
      _id,
      _date: resultDate,
      type: resultType,
      exchange: resultExchange,
      portfolio: resultPortfolio,
      operations: getDefaultOperations(resultType),
    };

    const forwardOp = result.operations.find((item) => item.type === OperationType.Forward);
    const backwardOp = result.operations.find((item) => item.type === OperationType.Backward);
    const commissionOp = result.operations.find((item) => item.type === OperationType.Commission);
    const taxOp = result.operations.find((item) => item.type === OperationType.Tax);

    if (forwardOp) {
      forwardOp.assetType = resultAssetType;
      forwardOp.name = resultSecurity;
      forwardOp.amount = resultQuantity;
    }

    if (backwardOp) {
      backwardOp.name = resultCurrency;
      backwardOp.amount = resultPrice;
    }

    if (commissionOp) {
      commissionOp.amount = resultCommissionOrTax;
      if (backwardOp) {
        commissionOp.name = backwardOp.name;
      }
    }

    if (taxOp) {
      taxOp.amount = resultCommissionOrTax;
      if (backwardOp) {
        taxOp.name = backwardOp.name;
      }
    }

    return result;
  }

  private createFixTransaction(transaction: Transaction): Transaction {
    const fixTransaction = this.transactionsStore.createEmpty();
    fixTransaction.updateFromDto({
      ...transaction.asDto,
      type: TransactionType.Deposit,
      operations: getDefaultOperations(TransactionType.Deposit),
    });

    if (!fixTransaction.forward) {
      throw new Error(`Forward operation wasn't found`);
    }
    fixTransaction.forward.setName(transaction.currency);
    fixTransaction.forward.setAmount(Math.abs(transaction.total));
    return fixTransaction;
  }

  private async combineInOne(ids: string[]): Promise<void> {
    const store = this.transactionsStore;
    await when(() => store.sortedList.length > 0);
    const transactions = store.sortedList.filter((item) => ids.includes(item.id));
    const firstDate = store.sortedList[store.sortedList.length - 1].date;
    const combineMap = new Map<string, Transaction>();

    if (transactions.length !== ids.length) {
      throw new Error(`Combined transactions mismatch`);
    }

    for (const transaction of transactions) {
      const key = [transaction.portfolio, transaction.assetType, transaction.security].join('.');
      let item: Transaction | null = null;

      if (!combineMap.has(key)) {
        item = store.createEmpty();
        item.updateFromDto(transaction.asDto);
        item.date = firstDate;
        combineMap.set(key, item);
        continue;
      }

      item = combineMap.get(key) || null;

      if (!item || !item.forward || !transaction.forward) {
        throw new Error(`Combine in one operation has been crashed`);
      }

      item.forward.setAmount(item.forward.amount + transaction.forward.amount);
    }

    // TODO: maybe need to revert operations if something goes wrong
    // set new items
    for (const transaction of Array.from(combineMap.values())) {
      await store.create(transaction.asDto);
    }

    // delete old's
    for (const transaction of transactions) {
      await store.delete(transaction.asDto);
    }
  }
}
