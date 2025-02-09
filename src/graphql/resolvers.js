import { GraphQLObjectType, GraphQLInt, GraphQLList, GraphQLID, GraphQLNonNull, GraphQLString } from "graphql";
import { UserType, ScanType, MealtimeType } from "./types.js";
import User from "../models/User.js";
import Scan from "../models/Scan.js";
import Mealtime from "../models/Mealtime.js";
import { getScanData } from "../services/scanService.js";
import { Op } from "sequelize";
import moment from "moment-timezone";

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
  nextMeal: {
    type: MealtimeType,
    resolve: async () => {
      const now = new Date();
      let meal = await Mealtime.findOne({
        where: {
          startTime: { [Op.lte]: now },
          endTime: { [Op.gte]: now }
        },
        order: [["startTime", "ASC"]]
      });
      if (!meal) {
        meal = await Mealtime.findOne({
          where: {
            startTime: { [Op.gte]: now }
          },
          order: [["startTime", "ASC"]]
        });
      }
      if (!meal) {
        meal = await Mealtime.findOne({ order: [["startTime", "ASC"]] });
      }
      return meal;
    }
  }
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
  setMealtime: {
    type: MealtimeType,
    args: {
      mealType: { type: new GraphQLNonNull(GraphQLString) },
      startTime: { type: new GraphQLNonNull(GraphQLString) },
      endTime: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve: async (_, { mealType, startTime, endTime }) => {
      try {
        const startTimeUTC = moment.tz(startTime, "YYYY-MM-DD HH:mm:ss", "America/New_York").utc().format();
        const endTimeUTC = moment.tz(endTime, "YYYY-MM-DD HH:mm:ss", "America/New_York").utc().format();
        const [meal, created] = await Mealtime.upsert({ mealType, startTime: startTimeUTC, endTime: endTimeUTC });
        return meal;
      } catch (error) {
        console.error("Error setting meal time:", error);
        throw new Error("Database update failed");
      }
    }    
  }
};