import Nano from "nano";

export interface IStore extends Nano.MaybeDocument {
  _id: string;
  name: string;
  code: string;
  itemIds: [string];
  requestRequisitionIds: [string];
  responseRequisitionIds: [string];
  type: string;
}