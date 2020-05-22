import { gql } from "apollo-server";
import { db } from "../index";
import { Requisition } from "../Database/Requisition/Requisition";
import { RequisitionLine } from "../Database/Requisition/RequisitionLine";

export const MutationSchema = gql`
  type Mutation {
    addRequisitionLine(requisitionId: String, itemId: String): RequisitionLine
    addRequisition(storeId: String): Requisition
    updateRequisitionLineQuantity(id: String, quantity: Int): RequisitionLine
  }
`;

export const MutationResolver = {
  Mutation: {
    addRequisition: async (_: any, args: any) => {
      const { storeId } = args;
      const newRequisition = new Requisition(storeId);
      await db.insert(newRequisition);
      return newRequisition;
    },
    addRequisitionLine: async (_: any, args: any) => {
      const { itemId } = args;
      const newRequisitionLine = new RequisitionLine({
        quantity: 0,
        itemId,
      });
      return newRequisitionLine;
    },
    updateRequisitionLineQuantity: async (_: any, args: any) => {
      const { itemId, quantity } = args;
      const requisitionLine = new RequisitionLine({
        itemId,
        quantity,
      });
      await db.insert(requisitionLine);
      return requisitionLine;
    },
  },
};
