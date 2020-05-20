import { IStore } from "./IStore";

export class Store implements IStore {
  _id: string;
  name: string;
  type: string;

  constructor({ name, id }) {
    this.name = name;
    this._id = id;
    this.type = "store";
  }
}
