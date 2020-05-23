import Nano from "nano";
import { IItem } from "../Item/IItem";

export interface IRequisitionLine extends Nano.MaybeDocument {
  _id: string;
  itemId: string;
  quantity: number;
  type: string;
}
