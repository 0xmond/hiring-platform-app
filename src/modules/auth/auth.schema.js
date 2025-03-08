import joi from "joi";
import { Genders } from "../../utils/enum/index.js";

export const googleSignIn = joi
  .object({
    token: joi.string().required(),
  })
  .required();

export const signup = joi
  .object({
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().min(8).required(),
    gender: joi
      .string()
      .valid(...Object.values(Genders))
      .required(),
  })
  .required();

export const confirmOTP = joi
  .object({
    email: joi.string().email().required(),
    otp: joi.string().length(6).required(),
  })
  .required();

export const login = joi
  .object({
    email: joi.string().email().required(),
    password: joi.string().required(),
  })
  .required();

export const forgetPassword = joi
  .object({ email: joi.string().email().required() })
  .required();

export const resetPassword = joi
  .object({
    email: joi.string().email().required(),
    otp: joi.string().length(6).required(),
    newPassword: joi.string().min(8).required(),
  })
  .required();

export const refreshToken = joi
  .object({
    refreshToken: joi.string().required(),
  })
  .required();
