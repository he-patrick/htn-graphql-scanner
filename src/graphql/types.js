import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLID } from "graphql";
import User from "../models/User.js";
import Scan from "../models/Scan.js";

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    userId: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
    badge_code: { type: GraphQLString },
    createdAt: { 
      type: GraphQLString,
      resolve: (user) => user.createdAt.toISOString(),
    },
    updatedAt: { 
      type: GraphQLString,
      resolve: (user) => user.updatedAt.toISOString(),
    },
    scans: {
      type: new GraphQLList(ScanType),
      resolve: (user) => Scan.findAll({ where: { userId: user.userId } }),
    },
  }),
});

const ScanType = new GraphQLObjectType({
  name: "Scan",
  fields: () => ({
    scanId: { type: GraphQLID },
    activity_name: { type: GraphQLString },
    scanned_at: { 
      type: GraphQLString,
      resolve: (scan) => scan.scanned_at.toISOString(),
    },
    activity_category: { type: GraphQLString },
    user: {
      type: UserType,
      resolve: (scan) => User.findByPk(scan.userId),
    },
  }),
});

export { UserType, ScanType };