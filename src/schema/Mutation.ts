import { gql } from "apollo-server";

import { items, stores, requisitions, requisitionLines } from "./mockData";

export const MutationSchema = gql`
  type Mutation {
    addRequisitionLine(requisitionId: String, itemId: String): RequisitionLine
    addRequisition(storeId: String): Requisition
    updateRequisitionLineQuantity(id: String, quantity: Int): RequisitionLine
  }
`;

export const MutationResolver = {
  Mutation: {
    addRequisition: (_: any, args: any) => {
      const { storeId } = args;

      const store = stores.find((s) => s.id === storeId);
      const newRequisition = {
        id: `req${Math.floor(Math.random() * 1000)}`,
        store: storeId,
        lines: [],
      };
      store.requisitions.push(newRequisition.id);
      requisitions.push(newRequisition);

      return newRequisition;
    },
    addRequisitionLine: (_: any, args: any) => {
      const { requisitionId, itemId } = args;
      const currentRequisition = requisitions.find(
        (requisition) => requisition.id === requisitionId
      );

      const newRequisitionLine = {
        id: `reqLine${Math.floor(Math.random() * 1000)}`,
        quantity: 0,
        item: itemId,
      };
      currentRequisition.lines.push(newRequisitionLine.id);
      requisitionLines.push(newRequisitionLine);

      return newRequisitionLine;
    },
    updateRequisitionLineQuantity: (_: any, args: any) => {
      const requisitionLine = requisitionLines.find(
        (line) => line.id === args.id
      );
      requisitionLine.quantity = args.quantity;
      return requisitionLine;
    },
  },
};
