import Nano from "nano";

export interface IItem extends Nano.MaybeDocument {
  _id: string;
  name: string;
  code: string;
  type: string;
}
