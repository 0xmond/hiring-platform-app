import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { companyType } from "./company.type.js";

export const getAllCompaniesResponse = new GraphQLObjectType({
  name: "getAllCompaniesResponse",
  fields: {
    success: { type: GraphQLBoolean },
    statusCode: { type: GraphQLString },
    data: { type: new GraphQLList(companyType) },
  },
});

export const banCompanyResponse = new GraphQLObjectType({
  name: "banCompanyResponse",
  fields: {
    success: { type: GraphQLBoolean },
    statusCode: { type: GraphQLInt },
    message: { type: GraphQLString },
  },
});

export const approveCompanyResponse = new GraphQLObjectType({
  name: "approveCompanyResponse",
  fields: {
    success: { type: GraphQLBoolean },
    statusCode: { type: GraphQLInt },
    message: { type: GraphQLString },
  },
});
