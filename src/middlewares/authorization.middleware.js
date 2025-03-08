import { unauthorized } from "../utils/messages/index.js";

export const isAuthorized = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(new Error(unauthorized, { cause: 401 }));
    return next();
  };
};
