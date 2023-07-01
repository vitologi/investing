import {IBaseEventDto} from "../dtos/base-event.dto";
import {ITransferBetweenPortfolioPayloadDto} from "../dtos/transfer-between-portfolio-payload.dto";
import {BaseEvent} from "./base-event";
import {EventType} from "../enums/event-type";

export class TransferBetweenPortfolioEvent extends BaseEvent<ITransferBetweenPortfolioPayloadDto> {
  type = EventType.TransferBetweenPortfolio;
  payload = {
    transactionId: '',
    oldPortfolioId: '',
    newPortfolioId: '',
  };

  constructor(dto?: IBaseEventDto<ITransferBetweenPortfolioPayloadDto>) {
    super(dto);
    if(dto){
      this.payload = dto.payload
    }
  }
}
