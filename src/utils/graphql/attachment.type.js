import { GraphQLID, GraphQLObjectType, GraphQLString } from "graphql";

export const attachmentType = new GraphQLObjectType({
  name: "attachment",
  fields: {
    public_id: { type: GraphQLID },
    secure_url: { type: GraphQLString },
  },
});
