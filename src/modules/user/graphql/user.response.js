import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { userType } from "./user.type.js";

export const getAllUsersResponse = new GraphQLObjectType({
  name: "getAllUsersResponse",
  fields: {
    success: { type: GraphQLBoolean },
    statusCode: { type: GraphQLString },
    data: { type: new GraphQLList(userType) },
  },
});

export const banUserResponse = new GraphQLObjectType({
  name: "banUserResponse",
  fields: {
    success: { type: GraphQLBoolean },
    statusCode: { type: GraphQLInt },
    message: { type: GraphQLString },
  },
});
