import joi from "joi";
import { Genders } from "../../utils/enum/index.js";
import { isValidId } from "../../middlewares/validation.middleware.js";
import { uploadSingleValidation } from "../../utils/upload/single.validation.js";

export const updateUser = joi
  .object({
    mobileNumber: joi
      .string()
      .pattern(/^(?:\+20|0)(1[0125]\d{8}|2\d{8}|3\d{8})$/)
      .optional(),
    dob: joi
      .date()
      .less(new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000)) // greater than 18 years old
      .message("Age must be greater than 18 years old")
      .optional(),
    firstName: joi.string().optional(),
    lastName: joi.string().optional(),
    gender: joi
      .string()
      .valid(...Object.values(Genders))
      .optional(),
  })
  .required();

export const getProfile = joi
  .object({ id: joi.custom(isValidId).optional() })
  .required();

export const updatePassword = joi
  .object({
    newPassword: joi.string().min(8).required(),
  })
  .required();
