import { IItem } from "./IItem";

export class Item implements IItem {
  _id: string;
  name: string;
  code: string;
  type: string;

  constructor({ name, code }) {
    this._id = undefined;
    this.name = name;
    this.code = code;
    this.type = "item";
  }
}
