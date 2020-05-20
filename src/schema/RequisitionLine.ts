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
    item: async (requisitionLine: any) => {
      const result = await db.find({ selector: { _id: requisitionLine.id } });

      return result.docs[0];
    },
  },
};
