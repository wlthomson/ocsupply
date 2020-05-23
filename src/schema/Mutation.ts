import { gql } from "apollo-server";
import { db } from "../index";
import { Requisition } from "../Database/Requisition/Requisition";

export const MutationSchema = gql`
  type Mutation {
    addRequisition(fromStoreId: String, toStoreId: String): Requisition
  }
`;

export const MutationResolver = {
  Mutation: {
    addRequisition: async (_: any, args: any) => {
      const { toStoreId, fromStoreId } = args;
      const newRequisition = new Requisition(toStoreId, fromStoreId);
      await db.insert(newRequisition);
      return newRequisition;
    },
  },
};
