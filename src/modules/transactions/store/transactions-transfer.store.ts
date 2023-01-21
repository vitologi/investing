import {inject, injectable} from 'inversify';
import {action, makeObservable} from 'mobx';
import {ImportType} from "../shared/enums/import-type";
import {TransactionsStore} from "./transactions.store";
import {uploadFile} from "../../../shared/utils/upload-file-content";
import {tsv2Json} from "../shared/utils/tsv-2-json";
import {ITransactionDto} from "../shared/dtos/transaction.dto";
import {CurrenciesStore} from "../../currencies/store/currencies.store";
import {PortfoliosStore} from "../../portfolios/store/portfolios.store";
import {ExchangeStore} from "../../exchanges/store/exchange.store";
import {AssetTypesStore} from "../../asset-types/store/asset-types.store";
import ObjectId from "bson-objectid";
import {TransactionAction} from "../shared/enums/transaction-action";
import {json2Tsv} from "../shared/utils/json-2-tsv";
import {saveAs} from "file-saver";
import {IntlStore} from "../../intl/store/intl.store";
import {Portfolio} from "../../portfolios/shared/models/portfolio";

@injectable()
export class TransactionsTransferStore {

  constructor(
    @inject('TransactionsStore') private transactionsStore: TransactionsStore,
    @inject('CurrenciesStore') private currenciesStore: CurrenciesStore,
    @inject('PortfoliosStore') private portfoliosStore: PortfoliosStore,
    @inject('ExchangeStore') private exchangeStore: ExchangeStore,
    @inject('AssetTypesStore') private assetTypesStore: AssetTypesStore,
    @inject('IntlStore') private intlStore: IntlStore,
  ) {
    makeObservable(this, {
      exportTransactions: action,
      importTransactions: action,
      clearAllTransactions: action,
    });
  }

  async importTransactions(props: { type?: ImportType } = {}): Promise<void> {
    const {type = ImportType.CSV} = props;
    let text: string;
    const dtos: ITransactionDto[] = [];

    switch (type) {
      case ImportType.CSV:
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
  }

  async exportTransactions(props: { type?: ImportType } = {}): Promise<void> {
    const {type = ImportType.CSV} = props;
    let text: string;
    let portfolioModel: Portfolio;

    if (!this.transactionsStore.list.length) {
      return;
    }

    switch (type) {
      case ImportType.CSV:
      default:
        text = json2Tsv(this.transactionsStore.list.map((item) => {
          const {
            assetType, security, action: actionResult, quantity,
            price, commission, currency, portfolio, exchange,
          } = item.asDto;

          let resultPortfolio = '';
          if (portfolio) {
            portfolioModel = this.portfoliosStore.item(portfolio) || this.portfoliosStore.list[0];
            resultPortfolio = portfolioModel.name;
          }

          return {
            date: item.date.toLocaleDateString(this.intlStore.locale),
            portfolio: resultPortfolio,
            assetType, security, action: actionResult, quantity,
            price, commission, currency, exchange
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

  private async validateTransaction(data: { [key: string]: string }): Promise<ITransactionDto> {
    const {
      date, assetType, security, action: dataAction, quantity,
      price, commission, currency, portfolio, exchange
    } = data;

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
    const resultCommission = commission ? parseFloat(commission.replaceAll(",", "")) : 0;
    const resultAction = (
      dataAction && Object.values(TransactionAction).includes(dataAction as TransactionAction)
    ) ? dataAction as TransactionAction : TransactionAction.Deposit;

    // TODO: need to set assertion
    const resultCurrency = currency || this.currenciesStore.enabledList[0].code;


    return {
      _id,
      _date: resultDate,
      assetType: resultAssetType,
      currency: resultCurrency,
      security: resultSecurity,
      quantity: resultQuantity,
      price: resultPrice,
      commission: resultCommission,
      action: resultAction,
      exchange: resultExchange,
      portfolio: resultPortfolio,
    }
  }
}
