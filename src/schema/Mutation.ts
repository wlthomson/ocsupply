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
      const { requisitionId, itemId } = args;
      const result = await db.find({ selector: { _id: itemId } });
      const newRequisitionLine = new RequisitionLine({
        quantity: 0,
        item: result.docs[0],
      });

      return newRequisitionLine;
    },
    updateRequisitionLineQuantity: async (_: any, args: any) => {
      const result = await db.find({ selector: { _id: args.id } });

      // HUH WHATS GOING ON TYPE SCRIPT
      const get = (obj: any) => ({
        quantity: obj.quantity || 0,
        item: obj.item || null,
      });

      const requisitionLine = new RequisitionLine({
        ...get(result.docs[0]),
        quantity: args.quantity,
      });

      await db.insert(requisitionLine);

      return requisitionLine;
    },
  },
};
