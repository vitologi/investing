import {EventType} from "../enums/event-type";
import {IBaseEventDto} from "./base-event.dto";
import {ITransferBetweenPortfolioPayloadDto} from "./transfer-between-portfolio-payload.dto";


export interface ITransferBetweenPortfolioEventDto extends IBaseEventDto<ITransferBetweenPortfolioPayloadDto>{
  type: EventType.TransferBetweenPortfolio;
}
