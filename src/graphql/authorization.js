import { unauthorized } from "../utils/messages/index.js";

export const isAuthorized = (roles, context) => {
  if (!roles.includes(context.user.role))
    throw new Error(unauthorized, { cause: 401 });
};
