import joi from "joi";

export const banCompany = joi
  .object({
    id: joi.string().required(),
  })
  .required();

export const approveCompany = joi
  .object({
    id: joi.string().required(),
  })
  .required();
