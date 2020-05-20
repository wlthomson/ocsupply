import { IRequisition } from "./IRequisition";

export class Requisition implements IRequisition {
  _id: string;
  storeId: string;
  type: string;

  constructor(storeId) {
    this.storeId = storeId;
    this._id = undefined;
    this.type = "requisition";
  }
}
