import { gql } from "apollo-server";
import { db } from "../index";

export const QuerySchema = gql`
  """
  Types which can be queried indepdently should live here in the Query type. For example, items, requisitions. However,
  if you don't want requisition lines to be queryable, don't put them here, instead have them as a field on a requisition.
  """
  type Query {
    "All items"
    items: [Item]

    "All facilities"
    stores: [Store]

    "All lines of all requisitions"
    requisitionLines: [RequisitionLine]

    "All requisitions for all stores"
    requisitions: [Requisition]

    "Fetch a particular requisition by id"
    getRequisition(id: String): Requisition

    "Fetch a particular item by id"
    getItem(name: String): Item

    "Fetch a particular store by id"
    getStore(code: String): Store
  }
`;

export const QueryResolvers = {
  Query: {
    items: async () => {
      const result = await db.find({ selector: { type: "item" } });
      return result.docs;
    },
    stores: async () => {
      const result = await db.find({ selector: { type: "store" } });
      return result.docs;
    },
    requisitionLines: async () => {
      const result = await db.find({ selector: { type: "requisitionLine" } });
      return result.docs;
    },
    requisitions: async () => {
      const result = await db.find({
        selector: { type: "requisition" },
        limit: 999999999,
      });
      return result.docs;
    },
    getRequisition: async (_: any, args: any) => {
      const result = await db.find({ selector: { _id: args.id } });
      const [requisition] = result.docs;
      return requisition;
    },
    getItem: async (_: any, args: any) => {
      const result = await db.find({ selector: { name: args.name } });
      const [item] = result.docs;
      return item;
    },
    getStore: async (_: any, args: any) => {
      const result = await db.find({ selector: { name: args.name } });
      const store = result.docs;
      return store;
    },
  },
};
