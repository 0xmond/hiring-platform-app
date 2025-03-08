import { Router } from "express";
import { asyncHandler } from "../../utils/error/async-handler.js";
import { isAuthenticate } from "../../middlewares/authentication.middleware.js";
import { isAuthorized } from "../../middlewares/authorization.middleware.js";
import { Roles } from "../../utils/enum/index.js";
import { isValid } from "../../middlewares/validation.middleware.js";
import { fileFormats, uploadFile } from "../../utils/upload/multer.js";
import * as companyValidation from "./company.schema.js";
import * as companyService from "./company.service.js";
import jobRouter from "../job/job.controller.js";
import { checkCompany } from "./company.middleware.js";

const router = Router();

// referencing to jobs child router
router.use("/:companyId/job", jobRouter);

// authentication
router.use(asyncHandler(isAuthenticate));

// create company
router.post(
  "/",
  isAuthorized([Roles.USER]),
  uploadFile(fileFormats.docs).single("attachment"),
  isValid(companyValidation.createCompany),
  asyncHandler(companyService.createCompany)
);

// search about company
router.get(
  "/",
  isAuthorized([Roles.USER]),
  isValid(companyValidation.searchAboutCompany),
  asyncHandler(companyService.searchAboutCompany)
);

// update company
router.put(
  "/:companyId",
  isAuthorized([Roles.USER]),
  isValid(companyValidation.updateCompany),
  asyncHandler(checkCompany),
  asyncHandler(companyService.updateCompany)
);

// soft delete company
router.delete(
  "/:companyId",
  isAuthorized([...Object.values(Roles)]),
  isValid(companyValidation.softDeleteCompany),
  asyncHandler(checkCompany),
  asyncHandler(companyService.softDeleteCompany)
);

// get company with jobs
router.get(
  "/:companyId",
  isAuthorized([Roles.USER]),
  isValid(companyValidation.getCompanyJobs),
  asyncHandler(checkCompany),
  asyncHandler(companyService.getCompanyJobs)
);

// get company applications in specific day {{ BONUS }}
router.get(
  "/:companyId/applications",
  isAuthorized([Roles.USER]),
  isValid(companyValidation.getJobApplicationsInSpecificDay),
  asyncHandler(checkCompany),
  asyncHandler(companyService.getJobApplicationsInSpecificDay)
);

// update logo
router.post(
  "/:companyId/logo",
  isAuthorized([Roles.USER]),
  uploadFile(fileFormats.images).single("attachment"),
  isValid(companyValidation.updateLogo),
  asyncHandler(checkCompany),
  asyncHandler(companyService.updateLogo)
);

// delete logo
router.delete(
  "/:companyId/logo",
  isAuthorized([Roles.USER]),
  isValid(companyValidation.deleteLogo),
  asyncHandler(checkCompany),
  asyncHandler(companyService.deleteLogo)
);

// update cover
router.post(
  "/:companyId/cover-pic",
  uploadFile(fileFormats.images).single("attachment"),
  isValid(companyValidation.updateCoverPic),
  asyncHandler(checkCompany),
  asyncHandler(companyService.updateCoverPic)
);

// delete cover
router.delete(
  "/:companyId/cover-pic",
  isValid(companyValidation.deleteCoverPic),
  asyncHandler(checkCompany),
  asyncHandler(companyService.deleteCoverPic)
);

export default router;
