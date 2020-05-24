import React from "react";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import Button from "@material-ui/core/Button";
import { TextField } from "@material-ui/core";

const NEW_REQUISITION = gql`
  mutation AddRequisition($fromStoreId: String, $toStoreId: String) {
    addRequisition(fromStoreId: $fromStoreId, toStoreId: $toStoreId) {
      fromStoreId
    }
  }
`;

export const NewRequisitionButton = () => {
  const [addRequisition, { data }] = useMutation(NEW_REQUISITION);
  const [fromStoreId, setFromStore] = React.useState("");
  const [toStoreId, setToStore] = React.useState("");
  return (
    <>
      <TextField
        label={"fromStore:"}
        onChange={(e) => setFromStore(e.target.value)}
        value={fromStoreId}
      />
      <TextField
        label={"toStore:"}
        onChange={(e) => setToStore(e.target.value)}
        value={toStoreId}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={() =>
          addRequisition({
            variables: { toStoreId, fromStoreId },
          })
        }
      ></Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setInterval(() => {
            addRequisition({
              variables: { toStoreId, fromStoreId },
            });
          }, 5000);
        }}
      >
        Auto generate requisitions!
      </Button>
    </>
  );
};
