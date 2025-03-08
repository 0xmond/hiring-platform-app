import { Router } from "express";
import { isValid } from "../../middlewares/validation.middleware.js";
import * as jobValidation from "./job.schema.js";
import * as jobService from "./job.service.js";
import { asyncHandler } from "../../utils/error/async-handler.js";
import { isAuthenticate } from "../../middlewares/authentication.middleware.js";
import { isAuthorized } from "../../middlewares/authorization.middleware.js";
import { Roles } from "../../utils/enum/index.js";
import { fileFormats, uploadFile } from "../../utils/upload/multer.js";

/**
 *
 * This controller is job searching
 *
 */

export const router = Router();

router.use(asyncHandler(isAuthenticate), isAuthorized([Roles.USER]));

// search in all system jobs
router.get(
  "/",
  isValid(jobValidation.searchJob),
  asyncHandler(jobService.searchJob)
);

export default router;
