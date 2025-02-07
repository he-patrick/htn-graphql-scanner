import { GraphQLList, GraphQLID, GraphQLNonNull, GraphQLString } from "graphql";
import { UserType, ScanType } from "./types.js";
import User from "../models/User.js";
import Scan from "../models/Scan.js";

export const queries = {
  users: {
    type: new GraphQLList(UserType),
    resolve: () => User.findAll({ include: [Scan] }),
  },
  user: {
    type: UserType,
    args: { id: { type: GraphQLID } },
    resolve: (_, { id }) => User.findByPk(id),
  },
  scans: {
    type: new GraphQLList(ScanType),
    resolve: () => Scan.findAll(),
  },
  userScans: {
    type: new GraphQLList(ScanType),
    args: { userId: { type: new GraphQLNonNull(GraphQLID) } },
    resolve: (_, { userId }) => Scan.findAll({ where: { userId } }),
  },
};

export const mutations = {
  addUser: {
    type: UserType,
    args: {
      name: { type: new GraphQLNonNull(GraphQLString) },
      email: { type: new GraphQLNonNull(GraphQLString) },
      phone: { type: new GraphQLNonNull(GraphQLString) },
      badge_code: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (_, args) => User.create(args),
  },
  addScan: {
    type: ScanType,
    args: {
      userId: { type: new GraphQLNonNull(GraphQLID) },
      activity_name: { type: new GraphQLNonNull(GraphQLString) },
      scanned_at: { type: GraphQLString },
      activity_category: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (_, args) => Scan.create(args),
  },
};