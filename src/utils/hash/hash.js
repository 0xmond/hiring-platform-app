import bcrypt from "bcrypt";

export const hash = (data) => {
  return bcrypt.hashSync(data, 10);
};
