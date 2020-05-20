import { typeDefs, resolvers } from "./schema";
import { ApolloServer } from "apollo-server";

const PORT = process.argv[2] || 4000;

new ApolloServer({ typeDefs, resolvers }).listen(PORT).then(({ url }) =>
  // tslint:disable-next-line:no-console
  console.log(
    `#####################################################\n🥳🥳🥳 Server started @ ${url} 🥳🥳🥳\n#####################################################`
  )
);
