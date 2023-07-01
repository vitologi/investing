import {EventType} from "../../enums/event-type";

const unknownDto = {
  _id: '_id',
  type: EventType.Unknown,
  source: null,
  payload: null,
  timestamp: new Date().getTime(),
};

export const mockDtos = [unknownDto];
