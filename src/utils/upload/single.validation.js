import joi from "joi";
import { isValidId } from "../../middlewares/validation.middleware.js";

export const attachmentType = {
  fieldname: joi.string().required(),
  originalname: joi.string().required(),
  encoding: joi.string().required(),
  mimetype: joi.string().required(),
  destination: joi.string().required(),
  filename: joi.string().required(),
  path: joi.string().required(),
  size: joi.number().required(),
};

export const uploadSingleValidation = joi
  .object({
    attachment: joi.object(attachmentType).required(),
  })
  .required();
