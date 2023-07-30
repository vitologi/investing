import {IBaseEventDto} from "../../../events/shared/dtos/base-event.dto";
import {ITransferBetweenPortfolioPayloadDto} from "../dtos/transfer-between-portfolio-payload.dto";
import {BaseEvent} from "../../../events/shared/models/base-event";
import {EventType} from "../../../events/shared/enums/event-type";

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
