import { IRequisitionLine } from "./IRequisitionLine";
import { IItem } from "../Item/IItem";

export class RequisitionLine implements IRequisitionLine {
  _id: string;
  itemId: string;
  quantity: number;
  type: string;

  constructor({ itemId, quantity }) {
    this._id = undefined;
    this.itemId = itemId;
    this.quantity = quantity;
    this.type = "requisitionLine";
  }
}
