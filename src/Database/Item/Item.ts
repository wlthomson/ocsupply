import { IItem } from "./IItem";

export class Item implements IItem {
  _id: string;
  name: string;
  code: string;
  type: string;

  constructor({ name, code }) {
    this.name = name;
    this._id = undefined;
    this.code = code;
    this.type = "item";
  }
}
