import { GraphQLBoolean, GraphQLObjectType, GraphQLString } from "graphql";
import { decrypt } from "../../../utils/crypto/decrypt.js";
import { attachmentType } from "../../../utils/graphql/attachment.type.js";

const otpType = new GraphQLObjectType({
  name: "otp",
  fields: {
    code: { type: GraphQLString },
    otpType: { type: GraphQLString },
    expiresIn: { type: GraphQLString },
  },
});

export const userType = new GraphQLObjectType({
  name: "user",
  fields: {
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: {
      type: GraphQLString,
    },
    provider: {
      type: GraphQLString,
    },
    gender: {
      type: GraphQLString,
    },
    dob: {
      type: GraphQLString,
    },
    mobileNumber: {
      type: GraphQLString,
    },
    role: {
      type: GraphQLString,
    },
    isConfirmed: {
      type: GraphQLBoolean,
    },
    deletedAt: { type: GraphQLString },
    bannedAt: { type: GraphQLString },
    updatedBy: { type: GraphQLString },
    changeCredentialTime: { type: GraphQLString },
    profilePic: { type: attachmentType },
    coverPic: { type: attachmentType },
    otp: { type: otpType },
  },
});
