import { GraphQLID } from "graphql";
import { banUserResponse } from "./user.response.js";
import * as userService from "./user.service.js";

export const userMutation = {
  banUser: {
    type: banUserResponse,
    args: { id: { type: GraphQLID } },
    resolve: userService.banUser,
  },
};
