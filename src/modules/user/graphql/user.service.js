import { Company } from "../../../db/models/company.model.js";
import { User } from "../../../db/models/user.model.js";
import { isAuthenticate } from "../../../graphql/authentication.js";
import { isAuthorized } from "../../../graphql/authorization.js";
import { isValid } from "../../../graphql/validation.js";
import { Roles } from "../../../utils/enum/index.js";
import { messages } from "../../../utils/messages/index.js";
import * as userValidation from "./user.schema.js";

export const getAllUsers = async (_, args, context) => {
  await isAuthenticate(context);
  isAuthorized(Roles.ADMIN, context);

  // get all users
  const users = await User.find({}, { password: 0 });

  // check if there is no users
  return { success: true, statusCode: 200, data: users };
};

export const banUser = async (_, args, context) => {
  await isAuthenticate(context);
  isAuthorized(Roles.ADMIN, context);
  isValid(userValidation.banUser, args);

  // update user
  const user = await User.findOne({ _id: args.id });

  // check existence of user
  if (!user) throw new Error(messages.user.notFound);

  // check if the user is banned or not
  if (user.bannedAt) await user.updateOne({ bannedAt: null });
  else await user.updateOne({ bannedAt: Date.now() });

  return {
    success: true,
    statusCode: 200,
    message: messages.user.updatedSuccessfully,
  };
};
