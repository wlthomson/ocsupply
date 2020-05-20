import Nano from "nano";

export interface IStore extends Nano.MaybeDocument {
  _id: string;
  name: string;
  type: string;
}
