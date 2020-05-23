import { IStore } from "./IStore";

export class Store implements IStore {
  _id: string;
  name: string;
  code: string;
  itemIds: [string];
  requestRequisitionIds: [string];
  responseRequisitionIds: [string];
  type: string;

  constructor({ id, name }) {
    this._id = id;
    this.name = name;
    this.type = "store";
  }
}
