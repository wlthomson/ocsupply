import Nano from "nano";
import { IItem } from "../Item/IItem";

export interface IRequisitionLine extends Nano.MaybeDocument {
  _id: string;
  quantity: number;
  item: IItem;
  type: string;
}
