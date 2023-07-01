import {inject, injectable} from 'inversify';
import {IBaseEventDto} from "../shared/dtos/base-event.dto";
import {EventsService} from "../shared/services/events.service";
import {EventType} from "../shared/enums/event-type";
import {TransferBetweenPortfolioEvent} from "../shared/models/transfer-between-portfolio-event";
import {IBaseEvent} from "../shared/interfaces/base-event";
import {ITransferBetweenPortfolioPayloadDto} from "../shared/dtos/transfer-between-portfolio-payload.dto";
import {ITransferBetweenPortfolioEventDto} from "../shared/dtos/transfer-between-portfolio-event.dto";

@injectable()
export class EventsStore {
  static key = Symbol('EventsStore');
  constructor(
    @inject(EventsService.key) private service: EventsService,
  ) {
  }

  create(type: EventType.TransferBetweenPortfolio, payload: ITransferBetweenPortfolioPayloadDto): TransferBetweenPortfolioEvent
  create(type: EventType, payload: unknown): IBaseEvent {
    let model: IBaseEvent;
    switch (type){
      case EventType.TransferBetweenPortfolio:
        model = new TransferBetweenPortfolioEvent();
        break;

      default:
        throw new Error(`Event type ${type} isn't supported`);
    }

    model.setPayload(payload);
    return model;
  }

  createFromDto(dto: ITransferBetweenPortfolioEventDto): TransferBetweenPortfolioEvent
  createFromDto(dto: IBaseEventDto): IBaseEvent {
    switch (dto.type){
      case EventType.TransferBetweenPortfolio:
        return new TransferBetweenPortfolioEvent(dto as ITransferBetweenPortfolioEventDto);

      default:
        throw new Error(`Event type ${dto.type} isn't supported`);
    }
  }

  async save(model: IBaseEvent): Promise<void> {
    await this.service.update(model.asDto); // TODO: handle exceptions
  }
}
