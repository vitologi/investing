import {EventType} from "../../../events/shared/enums/event-type";
import {ICommand} from "../../../events/shared/interfaces/command";
import {TransactionsStore} from "../../store/transactions.store";
import {TransferBetweenPortfolioEvent} from "./transfer-between-portfolio.event";
import {IBaseEventDto} from "../../../events/shared/dtos/base-event.dto";
import {ITransferBetweenPortfolioPayloadDto} from "../dtos/transfer-between-portfolio-payload.dto";

interface IInitialProps {
  broker: TransactionsStore,
  transactionId: string,
  newPortfolioId: string,
  oldPortfolioId: string,
}
interface IRestoreProps {
  broker: TransactionsStore,
  eventDto: IBaseEventDto<ITransferBetweenPortfolioPayloadDto>
}

export class TransferBetweenPortfolioCommand implements ICommand {
  readonly type = EventType.TransferBetweenPortfolio;
  private _event: TransferBetweenPortfolioEvent | null = null;
  private broker: TransactionsStore;
  private readonly transactionId: string;
  private readonly newPortfolioId: string;
  private readonly oldPortfolioId: string;

  constructor({broker, transactionId, newPortfolioId, oldPortfolioId}: IInitialProps)
  constructor({broker, eventDto}: IRestoreProps)
  constructor({broker, transactionId, newPortfolioId, oldPortfolioId, eventDto}: IRestoreProps & IInitialProps) {
    this.broker = broker;
    if (eventDto) {
      this._event = new TransferBetweenPortfolioEvent(eventDto);
      transactionId = this._event.payload.transactionId;
      oldPortfolioId = this._event.payload.oldPortfolioId;
      newPortfolioId = this._event.payload.newPortfolioId;
    }

    this.transactionId = transactionId;
    this.oldPortfolioId = oldPortfolioId;
    this.newPortfolioId = newPortfolioId;
  }

  get event(): TransferBetweenPortfolioEvent | null {
    return this._event;
  }

  async execute(): Promise<void> {
    if (this.event){
      return;
    }

    await this.broker.changePortfolio(this.transactionId, this.newPortfolioId, this.oldPortfolioId);
    const event = new TransferBetweenPortfolioEvent();
    event.setPayload({
      transactionId: this.transactionId,
      oldPortfolioId: this.oldPortfolioId,
      newPortfolioId: this.newPortfolioId,
    });
    this._event = event;
  }

  async undo(): Promise<void> {
    if (!this.event){
      return;
    }

    await this.broker.changePortfolio(this.transactionId, this.oldPortfolioId, this.newPortfolioId);
    this._event = null;
  }
}
