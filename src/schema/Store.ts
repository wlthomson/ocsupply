import { gql } from "apollo-server";

import { requisitions, items } from "./mockData";

export const StoreSchema = gql`
  """
  A generic Store record. Represents a physical facility.
  """
  type Store {
    "Unique identifier"
    id: ID

    "The name of a store"
    name: String

    "The code of an item"
    code: String

    "Visible items of this store"
    items: [Item]

    "This stores requisitions"
    requisitions: [Requisition]
  }
`;

export const StoreResolver = {
  Store: {
    requisitions: (store: any) =>
      requisitions.filter((requisition) =>
        store.requisitions.includes(requisition.id)
      ),
    items: (store: any) =>
      items.filter((item) => store.items.includes(item.id)),
  },
};
