import React from "react";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import Button from "@material-ui/core/Button";
import { TextField } from "@material-ui/core";

const NEW_REQUISITION = gql`
  mutation AddRequisition($fromStore: String, $toStore: String) {
    addRequisition(fromStore: $fromStore, toStore: $toStore) {
      id
    }
  }
`;

export const NewRequisitionButton = () => {
  const [addRequisition, { data }] = useMutation(NEW_REQUISITION);
  const [fromStore, setFromStore] = React.useState("");
  const [toStore, setToStore] = React.useState("");
  return (
    <>
      <TextField
        label={"fromStore:"}
        onChange={(e) => setFromStore(e.target.value)}
        value={fromStore}
      />
      <TextField
        label={"toStore:"}
        onChange={(e) => setToStore(e.target.value)}
        value={toStore}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={() =>
          addRequisition({
            variables: { toStore, fromStore },
          })
        }
      >
        Add Requisition!
      </Button>
    </>
  );
};
