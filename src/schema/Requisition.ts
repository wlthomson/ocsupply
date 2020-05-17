import { gql } from "apollo-server";

export const RequisitionSchema = gql`
  """
  A requisition.
  """
  type Item {
    "Unique identifier"
    id: ID

    "The lines of this requisition"
    lines: [RequisitionLines]

    "The store this requisition is made in"
    store: Store
  }
`;
