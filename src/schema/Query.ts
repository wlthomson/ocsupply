import { gql } from "apollo-server";

import { items, stores, requisitions, requisitionLines } from "./mockData";

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
    getItem(id: String): Item

    "Fetch a particular store by id"
    getStore(id: String): Store
  }
`;

export const QueryResolvers = {
  Query: {
    items: () => items,
    stores: () => stores,
    requisitionLines: () => requisitionLines,
    requisitions: () => requisitions,
    getRequisition: (_: any, args: any) =>
      requisitions.find((req) => req.id === args.id),
    getItem: (_: any, args: any) => items.find((item) => item.id === args.id),
    getStore: (_: any, args: any) =>
      stores.find((store) => store.id === args.id),
  },
};
