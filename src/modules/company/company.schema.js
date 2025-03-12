import joi from "joi";
import {
  attachmentType,
  uploadSingleValidation,
} from "../../utils/upload/single.validation.js";
import { EmployeesCount } from "../../utils/enum/index.js";
import { isValidId } from "../../middlewares/validation.middleware.js";

export const createCompany = joi
  .object({
    companyName: joi.string().required(),
    companyEmail: joi.string().email().required(),
    attachment: attachmentType,
  })
  .required();

export const updateCompany = joi
  .object({
    companyId: joi.custom(isValidId).required(),
    companyName: joi.string().optional(),
    description: joi.string().optional(),
    industry: joi.string().optional(),
    address: joi.string().optional(),
    numberOfEmployees: joi
      .string()
      .valid(...Object.values(EmployeesCount))
      .optional(),
    HRs: joi.array().items(joi.string().email().optional()),
  })
  .required();

export const softDeleteCompany = joi
  .object({ companyId: joi.custom(isValidId).required() })
  .required();

export const getCompanyJobs = joi
  .object({ companyId: joi.custom(isValidId).required() })
  .required();

export const getJobApplicationsInSpecificDay = joi
  .object({
    companyId: joi.custom(isValidId).required(),
    date: joi.date().required(),
  })
  .required();

export const searchAboutCompany = joi
  .object({
    companyName: joi.string().optional(),
  })
  .required();

export const updateLogo = joi
  .object({
    companyId: joi.custom(isValidId).optional(),
    attachment: attachmentType,
  })
  .required();

export const deleteLogo = joi
  .object({ companyId: joi.custom(isValidId).required() })
  .required();

export const updateCoverPic = joi
  .object({
    attachment: uploadSingleValidation,
  })
  .required();

export const deleteCoverPic = joi
  .object({ companyId: joi.custom(isValidId).required() })
  .required();

/**
 *    companyName,
      description,
      industry,
      address,
      numberOfEmployees,
      companyEmail,
      createdBy,
      logo,
      coverPic,
      HRs,
      bannedAt,
      legalAttachment,
      approvedByAdmin,
 */
