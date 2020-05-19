import { gql } from "apollo-server";

import { requisitionLines, stores } from "./mockData";

export const RequisitionSchema = gql`
  """
  A requisition.
  """
  type Requisition {
    "Unique identifier"
    id: ID

    "The lines of this requisition"
    lines: [RequisitionLine]

    "The store this requisition is made in"
    store: Store
  }
`;

export const RequisitionResolvers = {
  Requisition: {
    lines: (requisition: any) =>
      requisitionLines.filter((requisitionLine) =>
        requisition.lines.includes(requisitionLine.id)
      ),
    store: (requisition: any) =>
      stores.find((store) => requisition.store === store.id),
  },
};
