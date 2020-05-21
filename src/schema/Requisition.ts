import { gql } from "apollo-server";

export const RequisitionSchema = gql`
  """
  A requisition.
  """
  type Requisition {
    "Unique identifier"
    id: ID
  }
`;

export const RequisitionResolvers = {};
