import { typeDefs, resolvers } from "./schema";

import { ApolloServer } from "apollo-server";

new ApolloServer({ typeDefs, resolvers }).listen().then(({ url }) =>
  // tslint:disable-next-line:no-console
  console.log(
    `#####################################################\n🥳🥳🥳 Server started @ ${url} 🥳🥳🥳\n#####################################################`
  )
);
