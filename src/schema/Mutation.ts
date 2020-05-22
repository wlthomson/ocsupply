import { gql } from "apollo-server";
import { db } from "../index";
import { Requisition } from "../Database/Requisition/Requisition";

export const MutationSchema = gql`
  type Mutation {
    addRequisition(fromStore: String, toStore: String): Requisition
  }
`;

export const MutationResolver = {
  Mutation: {
    addRequisition: async (_: any, args: any) => {
      const { toStore, fromStore } = args;
      const newRequisition = new Requisition(toStore, fromStore);
      await db.insert(newRequisition);

      return newRequisition;
    },
  },
};
