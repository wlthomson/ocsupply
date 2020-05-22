import { IRequisition } from "./IRequisition";
import { IRequisitionLine } from "./IRequisitionLine";

export class Requisition implements IRequisition {
  _id: string;
  number: number;
  fromStoreId: string;
  toStoreId: string;
  requestRequisitionId: string;
  lines: [IRequisitionLine]
  type: string;

  constructor(fromStoreId) {
    this._id = undefined;
    this.fromStoreId = fromStoreId;
    this.toStoreId = "";
    this.type = "requisition";
  }
}
