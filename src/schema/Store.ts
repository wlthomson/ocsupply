import { gql } from "apollo-server";
import { db } from "../index";

export const StoreSchema = gql`
  """
  A generic Store record. Represents a physical facility.
  """
  type Store {
    "Unique identifier."
    _id: ID

    "The name of a store."
    name: String

    "The code of a store"
    code: String

    "The IDs of items active on a store."
    item_ids: [ID]

    "The items active on a store."
    items: [Item]

    "The IDs of request requisitions associated with this store."
    requestRequisitionIds: [ID]

    "The request requisitions associated with this store."
    requestRequisitions: [Requisition]

    "The IDs of response requisitions associated with this store."
    responseRequisitionIds: [ID]

    "The response requisitions associated with this store."
    responseRequisitions: [Requisition]
  }
`;

export const StoreResolvers = {
  Store: {
    items: async (store: any) => {
      const result = await db.find({ selector: { _id: { $in: store.itemIds } } });
      const items = result.docs;
      return items;
    },
    requestRequisitions: async (store: any) => {
      const result = await db.find({ selector: { _id: { $in: store.requestRequisitionIds } } });
      const requestRequisitions = result.docs;
      return requestRequisitions;
    },
    responseRequisitions: async (store: any) => {
      const result = await db.find({ selector: { _id: { $in: store.responseRequisitionIds } } });
      const responseRequisitions = result.docs;
      return responseRequisitions;
    },
  },
};
