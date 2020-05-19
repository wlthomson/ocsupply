import React from "react";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import Button from "@material-ui/core/Button";

const NEW_REQUISITION = gql`
  mutation AddRequisition($storeId: String) {
    addRequisition(storeId: $storeId) {
      id
    }
  }
`;

export const NewRequisitionButton = () => {
  const [addRequisition, { data }] = useMutation(NEW_REQUISITION);
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={() => addRequisition({ variables: { storeId: "store1" } })}
    >
      Add Requisition!
    </Button>
  );
};
