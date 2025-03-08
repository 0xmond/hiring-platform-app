import {
  GraphQLBoolean,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { User } from "../../../db/models/user.model.js";
import { userType } from "../../user/graphql/user.type.js";
import { attachmentType } from "../../../utils/graphql/attachment.type.js";

export const companyType = new GraphQLObjectType({
  name: "company",
  fields: {
    companyName: { type: GraphQLString },
    description: { type: GraphQLString },
    industry: { type: GraphQLString },
    address: { type: GraphQLString },
    numberOfEmployees: { type: GraphQLString },
    companyEmail: { type: GraphQLString },
    createdBy: {
      type: GraphQLString,
      resolve: async (parent) => {
        const user = await User.findById(parent.createdBy);
        return `${user.firstName} ${user.lastName}`;
      },
    },
    logo: { type: attachmentType },
    coverPic: { type: attachmentType },
    HRs: {
      type: new GraphQLList(userType),
    },
    bannedAt: { type: GraphQLString },
    legalAttachment: { type: attachmentType },
    approvedByAdmin: { type: GraphQLBoolean },
  },
});
