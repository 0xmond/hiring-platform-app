import joi from "joi";
import {
  JobLocations,
  SeniorityLevels,
  TechnicalSkills,
  WorkingTimes,
} from "../../utils/enum/index.js";
import { isValidId } from "../../middlewares/validation.middleware.js";

export const createJob = joi
  .object({
    companyId: joi.custom(isValidId).required(),
    jobTitle: joi.string().required(),
    jobLocation: joi
      .string()
      .valid(...Object.values(JobLocations))
      .optional(),
    workingTime: joi
      .string()
      .valid(...Object.values(WorkingTimes))
      .optional(),
    seniorityLevel: joi
      .string()
      .valid(...Object.values(SeniorityLevels))
      .optional(),
    jobDescription: joi.string().required(),
    technicalSkills: joi
      .array()
      .items(
        joi
          .string()
          .valid(...TechnicalSkills)
          .required()
      )
      .required(),
    softSkills: joi.array().items(joi.string().required()).optional(),
  })
  .required();

export const updateJob = joi
  .object({
    companyId: joi.custom(isValidId).required(),
    jobId: joi.custom(isValidId).required(),
    jobTitle: joi.string().required(),
    jobLocation: joi
      .string()
      .valid(...Object.values(JobLocations))
      .optional(),
    workingTime: joi
      .string()
      .valid(...Object.values(WorkingTimes))
      .optional(),
    seniorityLevel: joi
      .string()
      .valid(...Object.values(SeniorityLevels))
      .optional(),
    jobDescription: joi.string().required(),
    technicalSkills: joi
      .array()
      .items(
        joi
          .string()
          .valid(...TechnicalSkills)
          .required()
      )
      .required(),
    softSkills: joi.array().items(joi.string().required()).optional(),
  })
  .required();

export const deleteJob = joi
  .object({
    companyId: joi.custom(isValidId).required(),
    jobId: joi.custom(isValidId).required(),
  })
  .required();

export const getJob = joi
  .object({
    companyId: joi.custom(isValidId).required(),
    jobId: joi.custom(isValidId).optional(),
    size: joi.number().when("jobId", {
      is: joi.exist(),
      then: joi.forbidden(),
      otherwise: joi.required(),
    }),
    page: joi.number().when("jobId", {
      is: joi.exist(),
      then: joi.forbidden(),
      otherwise: joi.required(),
    }),
  })
  .required();

export const searchJob = joi
  .object({
    companyId: joi.custom(isValidId).required(),
    jobId: joi.custom(isValidId).required(),
    size: joi.number().required(),
    page: joi.number().required(),
    jobTitle: joi.string().optional(),
    workingTime: joi
      .array()
      .items(
        joi
          .string()
          .valid(...Object.values(WorkingTimes))
          .required()
      )
      .optional(),
    jobLocation: joi
      .array()
      .items(
        joi
          .string()
          .valid(...Object.values(JobLocations))
          .required()
      )
      .optional(),
    seniorityLevel: joi
      .array()
      .items(
        joi
          .string()
          .valid(...Object.values(SeniorityLevels))
          .required()
      )
      .optional(),
    technicalSkills: joi
      .array()
      .items(
        joi
          .string()
          .valid(...Object.values(TechnicalSkills))
          .required()
      )
      .optional(),
  })
  .required();
