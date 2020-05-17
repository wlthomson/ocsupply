import { gql } from "apollo-server";

export const QuerySchema = gql`
  """
  Types which can be queried indepdently should live here in the Query type. For example, items, requisitions. However,
  if you don't want requisition lines to be queryable, don't put them here, instead have them as a field on a requisition.
  """
  type Query {
    "The name of an Item"
    items: [Item]
  }
`;

// Basic test data
const items = [
  {
    name: "Ibuprofen",
    code: "IBU",
  },
  {
    name: "Paracetamol",
    code: "PCT",
  },
];

export const QueryResolvers = {
  Query: {
    items: () => items,
  },
};
