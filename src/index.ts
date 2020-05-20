import { typeDefs, resolvers } from "./schema";
import { ApolloServer } from "apollo-server";

import Nano from "nano";

const PORT = process.argv[2] || 4000;
const COUCH_PORT = process.argv[3] || 5984;
const COUCH_USERNAME = process.argv[4] || "admin";
const COUCH_PASSWORD = process.argv[5] || "pass";
const COUCH_DB_NAME = process.argv[6] || "msupply";

const n = Nano(
  `http://${COUCH_USERNAME}:${COUCH_PASSWORD}@localhost:${COUCH_PORT}`
);
export const db = n.db.use(COUCH_DB_NAME);

new ApolloServer({ typeDefs, resolvers }).listen(PORT).then(({ url }) =>
  // tslint:disable-next-line:no-console
  console.log(
    `#####################################################\n🥳🥳🥳 Server started @ ${url} 🥳🥳🥳\n#####################################################`
  )
);
