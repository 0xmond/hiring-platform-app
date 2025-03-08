import { User } from "../db/models/user.model.js";
import { verifyToken } from "../utils/token/verify-token.js";

export const isAuthenticate = async (req, res, next) => {
  // get token from request headers
  const token = req.headers.authorization;

  // verify the token and get the payload -> payload = { _id, email, iat }
  const payload = verifyToken({ token }); // returns payload || throws exception

  if (payload.error) return next(payload.error);

  // get user data
  const user = await User.findById(payload._id, {
    password: 0,
    updatedAt: 0,
    isConfirmed: 0,
  }).lean();

  // check if token is invalid
  if (
    !user ||
    user.deletedAt ||
    user.changeCredentialTime.getTime() > payload.iat * 1000
  )
    return next(new Error("Invalid token", { cause: 400 }));

  if (user.bannedAt)
    return next(new Error("This user is banned", { cause: 401 }));

  // pass user data in request object to next node in pipeline
  req.user = user;

  return next();
};
