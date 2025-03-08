import Randomstring from "randomstring";

export const generateOTP = () => {
  return Randomstring.generate({ length: 6, charset: "numeric" });
};
