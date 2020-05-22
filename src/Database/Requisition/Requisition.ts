import { IRequisition } from "./IRequisition";

export class Requisition implements IRequisition {
  _id: string;
  toStore: string;
  fromStore: string;
  type: string;

  constructor(toStore, fromStore) {
    this.toStore = toStore;
    this.fromStore = fromStore;
    this._id = undefined;
    this.type = "requisition";
  }
}
