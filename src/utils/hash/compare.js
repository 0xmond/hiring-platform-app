import bcrypt from "bcrypt";

export const compare = ({ data, hashedData }) => {
  return bcrypt.compareSync(data, hashedData);
};
