import { gql } from "apollo-server";
import { db } from "../index";

export const RequisitionLineSchema = gql`
  """
  A RequisitionLine record. A line on a requisition.
  """
  type RequisitionLine {
    "Unique identifier"
    id: ID

    "The name of an Ite"
    item: Item

    "The code of an item"
    quantity: Int
  }
`;

export const RequisitionLineResolvers = {
  RequisitionLine: {
    item: async (requisitionLine) => {
      const itemResult = await db.find({
        selector: { _id: requisitionLine.item },
      });
      return itemResult.docs[0];
    },
  },
};
