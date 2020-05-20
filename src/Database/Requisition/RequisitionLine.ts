import { IRequisitionLine } from "./IRequisitionLine";
import { IItem } from "../Item/IItem";

export class RequisitionLine implements IRequisitionLine {
  _id: string;
  quantity: number;
  type: string;
  item: IItem;

  constructor({ quantity, item }) {
    this.quantity = quantity;
    this._id = undefined;
    this.item = item;
    this.type = "requisitionLine";
  }
}
