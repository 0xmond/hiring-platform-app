import { Router } from "express";
import * as jobService from "./job.service.js";
import { isAuthenticate } from "../../middlewares/authentication.middleware.js";
import { asyncHandler } from "../../utils/error/async-handler.js";
import { isAuthorized } from "../../middlewares/authorization.middleware.js";
import { Roles } from "../../utils/enum/index.js";
import { isValid } from "../../middlewares/validation.middleware.js";
import * as jobValidation from "./job.schema.js";
import { checkCompany } from "../company/company.middleware.js";
import checkJob from "./job.middleware.js";
import applicationRouter from "../application/application.controller.js";

/**
 *
 * This controller is the main jobs controller
 *
 */

const router = Router({ mergeParams: true });

// application router
router.use("/:jobId/application/", applicationRouter);

// authentication and authorization
router.use(asyncHandler(isAuthenticate), isAuthorized([Roles.USER]));

// create job
router.post(
  "/",
  isValid(jobValidation.createJob),
  checkCompany,
  asyncHandler(jobService.createJob)
);

router
  .route("/:jobId")

  // update job
  .put(
    isValid(jobValidation.updateJob),
    checkCompany,
    checkJob,
    asyncHandler(jobService.updateJob)
  )
  // delete job
  .delete(
    isValid(jobValidation.deleteJob),
    checkCompany,
    checkJob,
    asyncHandler(jobService.deleteJob)
  );

// get all jobs or a specific one for a specific company
router.get(
  "/:jobId?",
  isValid(jobValidation.getJob),
  checkCompany,
  asyncHandler(jobService.getJob)
);

export default router;
