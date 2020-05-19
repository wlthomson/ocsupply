import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { ApolloProvider } from "@apollo/react-hooks";
import ApolloClient, { gql } from "apollo-boost";
import { Requisitions } from "./Requisitions";
import { NewRequisitionButton } from "./NewRequisitionButton";

const client = new ApolloClient({
  uri: "http://localhost:4000",
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <NewRequisitionButton />
        <Requisitions />
      </div>
    </ApolloProvider>
  );
}

export default App;
