import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { userQuery } from "./modules/user/graphql/user.query.js";
import { companyQuery } from "./modules/company/graphql/company.query.js";
import { userMutation } from "./modules/user/graphql/user.mutation.js";
import { companyMutation } from "./modules/company/graphql/company.mutation.js";

const query = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    ...userQuery,
    ...companyQuery,
  },
});

const mutation = new GraphQLObjectType({
  name: "RootMutation",
  fields: {
    ...userMutation,
    ...companyMutation,
  },
});

export const schema = new GraphQLSchema({
  query,
  mutation,
});
