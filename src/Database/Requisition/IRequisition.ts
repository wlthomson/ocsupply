import Nano from "nano";

export interface IRequisition extends Nano.MaybeDocument {
  _id: string;
  storeId: string;
  type: string;
}
