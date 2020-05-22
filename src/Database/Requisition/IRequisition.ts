import Nano from "nano";

export interface IRequisition extends Nano.MaybeDocument {
  _id: string;
  toStore: string;
  fromStore: string;
  type: string;
}
