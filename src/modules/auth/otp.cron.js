import { User } from "../../db/models/user.model.js";

export const otpCronDeletion = async () => {
  const now = new Date();

  await User.updateMany(
    { "otp.expiresIn": { $lte: now } },
    { $unset: { otp: "" } }
  );
};
