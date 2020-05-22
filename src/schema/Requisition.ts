import { gql } from "apollo-server";

export const RequisitionSchema = gql`
  """
  A requisition.
  """
  type Requisition {
    "Unique identifier"
    id: ID

    fromStore: String

    toStore: String

    number: String

    lines: [RequisitionLine]
  }
`;

export const RequisitionResolvers = {};
