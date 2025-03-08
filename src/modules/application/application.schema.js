import joi from "joi";
import { isValidId } from "../../middlewares/validation.middleware.js";
import { attachmentType } from "../../utils/upload/single.validation.js";

export const createApplication = joi
  .object({
    attachment: attachmentType,
    companyId: joi.custom(isValidId).required(),
    jobId: joi.custom(isValidId).required(),
  })
  .required();

export const updateApplicationStatus = joi
  .object({
    id: joi.custom(isValidId).required(),
    companyId: joi.custom(isValidId).required(),
    jobId: joi.custom(isValidId).required(),
    status: joi.boolean().required(),
  })
  .required();

export const getJobApplications = joi
  .object({
    companyId: joi.custom(isValidId).required(),
    jobId: joi.custom(isValidId).required(),
    page: joi.number().required(),
    size: joi.number().required(),
  })
  .required();
