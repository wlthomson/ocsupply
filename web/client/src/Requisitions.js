import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles({
  table: {
    maxWidth: 650,
  },
});

const REQUISITIONS = gql`
  {
    requisitions {
      fromStore {
        name
      }
      toStore {
        name
      }
    }
  }
`;

export const Requisitions = () => {
  const { loading, error, data } = useQuery(REQUISITIONS, {
    pollInterval: 500,
  });

  const classes = useStyles();
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="right">Number</TableCell>
            <TableCell align="right">fromStoreId</TableCell>
            <TableCell align="right">toStoreId</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.requisitions.map((row, i) => {
            return (
              <TableRow key={row.id}>
                <TableCell align="right">{i}</TableCell>
                <TableCell align="right">
                  {row?.fromStore?.name ?? "N/A"}
                </TableCell>
                <TableCell align="right">
                  {row?.toStore?.name ?? "N/A"}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
