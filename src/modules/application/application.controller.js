import { Router } from "express";
import { isAuthenticate } from "../../middlewares/authentication.middleware.js";
import { isAuthorized } from "../../middlewares/authorization.middleware.js";
import { Roles } from "../../utils/enum/index.js";
import { asyncHandler } from "../../utils/error/async-handler.js";
import { isValid } from "../../middlewares/validation.middleware.js";
import * as applicationService from "./application.service.js";
import checkJob from "../job/job.middleware.js";
import { fileFormats, uploadFile } from "../../utils/upload/multer.js";
import { checkCompany } from "../company/company.middleware.js";
import { uploadSingleValidation } from "../../utils/upload/single.validation.js";
import * as applicationValidation from "./application.schema.js";

const router = Router({ mergeParams: true });

router.use(
  asyncHandler(isAuthenticate),
  isAuthorized([Roles.USER]),
  checkCompany,
  checkJob
);

// apply for job
router.post(
  "/",
  uploadFile(fileFormats.docs).single("attachment"),
  isValid(applicationValidation.createApplication),
  asyncHandler(applicationService.applyForJob)
);

// accept or reject applicant
router.patch(
  "/:id",
  isValid(applicationValidation.updateApplicationStatus),
  asyncHandler(checkCompany),
  asyncHandler(checkJob),
  asyncHandler(applicationService.updateApplicationStatus)
);

// get all applications of specific job
router.get(
  "/",
  isValid(applicationValidation.getJobApplications),
  asyncHandler(applicationService.getJobApplications)
);

export default router;
