import { gql } from "apollo-server";

export const StoreSchema = gql`
  """
  A generic Store record. Represents a physical facility.
  """
  type Store {
    "Unique identifier"
    id: ID

    "The name of a store"
    name: String

    "The code of an item"
    code: String
  }
`;

export const StoreResolver = {
  Store: {},
};
