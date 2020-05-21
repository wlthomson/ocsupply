import React from "react";
import "./App.css";
import { ApolloProvider } from "@apollo/react-hooks";
import ApolloClient from "apollo-boost";
import TextField from "@material-ui/core/TextField";
import { Requisitions } from "./Requisitions";
import { NewRequisitionButton } from "./NewRequisitionButton";

function App() {
  const [graphqlUri, setGraphqlUri] = React.useState("http://localhost:4000");
  const [apolloClient, setApolloClient] = React.useState(
    new ApolloClient({ uri: graphqlUri })
  );

  const setNewClient = React.useCallback((e) => {
    setGraphqlUri(e.target.value);
    setApolloClient(new ApolloClient({ uri: e.target.value }));
  });

  return (
    <ApolloProvider client={apolloClient}>
      <div className="App">
        <div
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TextField
            label={"GraphQL Server Uri:"}
            onChange={setNewClient}
            value={graphqlUri}
          />
          <NewRequisitionButton />
          <Requisitions />
        </div>
      </div>
    </ApolloProvider>
  );
}

export default App;
