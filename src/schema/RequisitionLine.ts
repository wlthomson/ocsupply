import { gql } from "apollo-server";

import { items } from "./mockData";

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
    item: (requisitionLine: any) =>
      items.find((item) => item.id === requisitionLine.item),
  },
};
