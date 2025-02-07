import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { queries, mutations } from "./resolvers.js";

const QueryType = new GraphQLObjectType({
  name: "Query",
  fields: queries,
});

const MutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: mutations,
});

export default new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
});
