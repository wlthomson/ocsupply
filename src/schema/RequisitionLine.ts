import { gql } from "apollo-server";
import { db } from "../index";

export const RequisitionLineSchema = gql`
  """
  A RequisitionLine record. A line on a requisition.
  """
  type RequisitionLine {
    "The ID of the item associated with this requisition line."
    itemId: ID

    "The item associated with this requisition line."
    item: Item

    "The requested quantity of the item."
    quantity: Int
  }
`;

export const RequisitionLineResolvers = {
  RequisitionLine: {
    item: async (requisitionLine: any) => {
      const result = await db.find({ selector: { _id: requisitionLine.itemId } });
      const [item] = result.docs;
      return item;
    },
  },
};
