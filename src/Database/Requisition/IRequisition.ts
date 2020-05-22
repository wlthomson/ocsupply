import Nano from "nano";
import { IRequisitionLine } from "./IRequisitionLine";

export interface IRequisition extends Nano.MaybeDocument {
  _id: string;
  number: number;
  fromStoreId: string;
  toStoreId: string;
  requestRequisitionId: string;
  lines: [IRequisitionLine]
  type: string;
}