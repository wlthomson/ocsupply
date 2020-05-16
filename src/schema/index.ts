import { makeExecutableSchema } from "apollo-server";

import { ItemSchema } from "./Item";
import { QuerySchema, QueryResolvers } from "./Query";

/**
 * A GraphQL schema should be designed client - first. Disregard how it is stored. Design queries
 * to provide clients with how they will directly use the data and use resolvers to transform the
 * data independent of how it is stored.
 *
 * A GraphQL schema is a collection of type definitions and resolvers.
 * Each type has fields, and each field is required to resolve to some
 * scalar value. Each resolver will resolve a field of a type to that
 * scalar value.
 *
 * Possible types:
 * - Query and Mutation types are entry points for read/writes.
 * - Object types are other defined types
 * - Scalar types - primitives: int/float/string/bool/ID/custom scalars
 * - Input types are objects as parameters.
 *
 * Conventions:
 * - fields: camelCase
 * - types: PascalCase
 * - enum names: PascalCase
 * - enum values: SHOUTY_CASE
 *
 */

export const typeDefs = [ItemSchema, QuerySchema];
export const resolvers = [QueryResolvers];
