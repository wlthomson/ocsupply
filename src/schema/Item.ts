import { gql } from "apollo-server";

export const ItemSchema = gql`
  """
  A generic Item record. For example a medicine like Ibuprofen, or a Sach, like a Nut Sach
  """
  type Item {
    "Unique item identifier"
    _id: ID

    "The name of an Item"
    name: String

    "The code of an item"
    code: String
  }
`;
