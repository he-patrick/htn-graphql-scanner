import { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLID } from "graphql";
import User from "../models/User.js";
import Scan from "../models/Scan.js";
import Karaoke from "../models/Karaoke.js";

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

const KaraokeType = new GraphQLObjectType({
  name: "Karaoke",
  fields: () => ({
    karaokeId: { type: GraphQLID },
    song_name: { type: GraphQLString },
    artist: { type: GraphQLString },
    youtube_link: { type: GraphQLString },
    userId: { type: GraphQLID },
    createdAt: { 
      type: GraphQLString,
      resolve: (karaoke) => karaoke.createdAt ? karaoke.createdAt.toISOString() : null,
    },
    updatedAt: { 
      type: GraphQLString,
      resolve: (karaoke) => karaoke.updatedAt ? karaoke.updatedAt.toISOString() : null,
    },
    user: {
      type: UserType,
      resolve: (karaoke) => User.findByPk(karaoke.userId),
    },
  }),
});


const MealtimeType = new GraphQLObjectType({
  name: "Mealtime",
  fields: () => ({
    mealType: { type: GraphQLString },
    startTime: { 
      type: GraphQLString,
      resolve: (mealtime) => mealtime.startTime.toISOString(),
    },
    endTime: { 
      type: GraphQLString,
      resolve: (mealtime) => mealtime.endTime.toISOString(),
    }
  })
});

export { UserType, ScanType, KaraokeType, MealtimeType };