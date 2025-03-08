import joi from "joi";
import { isValidObjectId } from "mongoose";

export const banUser = joi
  .object({
    id: joi.string().required(),
  })
  .required();
