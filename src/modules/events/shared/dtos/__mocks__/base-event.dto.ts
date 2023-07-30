import {EventType} from "../../enums/event-type";
import {IBaseEventDto} from "../base-event.dto";
import {
  ITransferBetweenPortfolioPayloadDto
} from "../../../../transactions/shared/dtos/transfer-between-portfolio-payload.dto";

const portfolioDto: IBaseEventDto<ITransferBetweenPortfolioPayloadDto> = {
  _id: '_id',
  type: EventType.TransferBetweenPortfolio,
  source: null,
  payload: {
    transactionId: 'null',
    oldPortfolioId: 'null',
    newPortfolioId: 'null',
  },
  timestamp: new Date().getTime(),
};

export const mockDtos = [portfolioDto];
