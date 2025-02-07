import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLID } from "graphql";
import User from "../models/User.js";
import Scan from "../models/Scan.js";

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
    badge_code: { type: GraphQLString },
    updated_at: { type: GraphQLString },
    scans: {
      type: new GraphQLList(ScanType),
      resolve: (user) => Scan.findAll({ where: { userId: user.id } }),
    },
  }),
});

const ScanType = new GraphQLObjectType({
  name: "Scan",
  fields: () => ({
    id: { type: GraphQLID },
    activity_name: { type: GraphQLString },
    scanned_at: { type: GraphQLString },
    activity_category: { type: GraphQLString },
    user: {
      type: UserType,
      resolve: (scan) => User.findByPk(scan.userId),
    },
  }),
});

export { UserType, ScanType }