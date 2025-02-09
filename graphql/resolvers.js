import { GraphQLObjectType, GraphQLInt, GraphQLList, GraphQLID, GraphQLNonNull, GraphQLString } from "graphql";
import { UserType, ScanType } from "./types.js";
import User from "../models/User.js";
import Scan from "../models/Scan.js";
import { getScanData } from "../services/scanService.js";

export const queries = {
  users: {
    type: new GraphQLList(UserType),
    resolve: () => User.findAll({ include: [Scan] }),
  },
  user: {
    type: UserType,
    args: { userId: { type: GraphQLID } },
    resolve: (_, { userId }) => User.findByPk(userId, { include: [Scan] }),
  },
  scans: {
    type: new GraphQLList(
      new GraphQLObjectType({
        name: "ScanAggregate",
        fields: {
          activity_name: { type: GraphQLString },
          frequency: { type: GraphQLInt },
        },
      })
    ),
    args: {
      min_frequency: { type: GraphQLInt },
      max_frequency: { type: GraphQLInt },
      activity_category: { type: GraphQLString },
    },
    resolve: async (_, args) => {
      const results = await getScanData(args);
      return results;
    },
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
      activity_category: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (_, args) => {
      const user = await User.findByPk(args.userId);
      if (!user) {
        throw new Error("User not found");
      }
      user.updatedAt = Date.now();
      await user.save();
      return Scan.create(args);
    },
  },
  updateUser: {
    type: UserType,
    args: {
      userId: { type: new GraphQLNonNull(GraphQLID) },
      name: { type: GraphQLString },
      phone: { type: GraphQLString },
      badge_code: { type: GraphQLString }
    },
    resolve: async (_, { userId, ...updates }) => {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error("User not found");
      }
      user.updatedAt = Date.now();
      await user.save();
      await user.update(updates);
      return user;
    }
  },
};