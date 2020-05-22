import { gql } from "apollo-server";
import { db } from "../index";

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

    items: [Item]

    responseRequisitions: [Requisition]
    requestRequisitions: [Requisition]
  }
`;

export const StoreResolver = {
  Store: {
    items: async (store) => {
      const { items } = store;
      const itemsResult = await db.find({ selector: { _id: { $in: items } } });

      return itemsResult.docs;
    },
    responseRequisitions: async (store) => {
      const { responseRequisitions } = store;
      const requisitionsResult = await db.find({
        selector: { _id: { $in: responseRequisitions } },
      });
      return requisitionsResult.docs;
    },
    requestRequisitions: async (store) => {
      const { requestRequisitions } = store;
      const requisitionsResult = await db.find({
        selector: { _id: { $in: requestRequisitions } },
      });
      return requisitionsResult.docs;
    },
  },
};
