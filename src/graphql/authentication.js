import { User } from "../db/models/user.model.js";
import { verifyToken } from "../utils/token/verify-token.js";

export const isAuthenticate = async (context) => {
  // get token from request headers
  const token = context.authorization;

  // verify the token and get the payload -> payload = { _id, email, iat }
  const payload = verifyToken({ token }); // returns payload || throws exception

  if (payload.error) throw new Error(payload.error.message, { cause: 401 });

  // get user data
  const user = await User.findById(payload._id, {
    password: 0,
    updatedAt: 0,
    isConfirmed: 0,
  }).lean();

  // check if token is invalid
  if (!user || user.deletedAt) throw new Error("Invalid token", { cause: 400 });

  // pass user data in request object to next node in pipeline
  context.user = user;
};
