import { getAllUsersResponse } from "./user.response.js";
import { getAllUsers } from "./user.service.js";

export const userQuery = {
  getAllUsers: { type: getAllUsersResponse, resolve: getAllUsers },
};
