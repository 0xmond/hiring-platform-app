import { Application } from "../../db/models/application.model.js";
import { Job } from "../../db/models/job.model.js";
import {
  acceptanceMail,
  rejectionMail,
} from "../../utils/email/email-temps.js";
import { sendEmail } from "../../utils/email/send-email.js";
import { Status } from "../../utils/enum/index.js";
import { hiddenUserSensitiveData } from "../../utils/hidden/index.js";
import {
  messages,
  unauthorized,
  updateApplicationStatusResponse,
} from "../../utils/messages/index.js";
import cloudinary from "../../utils/upload/cloudinary.js";

export const applyForJob = async (req, res, next) => {
  // check if user already applied for job
  const isApplied = await Application.findOne({
    applierId: req.user._id,
    jobId: req.job._id,
    deletedAt: null,
  });

  if (isApplied)
    return next(new Error(messages.application.alreadyApplied, { cause: 400 }));

  // upload cv to cloud
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `/job-search-app/companies/${req.job.companyId}/jobs/${req.job._id}/applications`,
    }
  );

  // store it in db
  const application = await Application.create({
    userCV: { public_id, secure_url },
    applierId: req.user._id,
    jobId: req.job._id,
  });

  req.io.emit("applyForJob", {
    companyId: req.job.companyId,
    userName: req.user.firstName,
  });

  // send success response
  return res
    .status(201)
    .json({ success: true, message: messages.application.createdSuccessfully });
};

export const updateApplicationStatus = async (req, res, next) => {
  // parse applications id from request params
  const { id } = req.params;
  const { status } = req.body; // boolean

  if (!req.company.HRs.includes(req.user._id))
    return next(new Error(unauthorized, { cause: 401 }));

  // check existance of job application
  const application = await Application.findOne({
    _id: id,
    deletedAt: null,
    jobId: req.job._id,
  }).populate([{ path: "applierId", select: "email" }]);

  if (!application)
    return next(new Error(messages.application.notFound, { cause: 404 }));

  // check if the application already accepted or rejected
  if ([Status.ACCEPTED, Status.REJECTED].includes(application.status))
    return next(
      new Error(
        `This application is aleady ${application.status.toLowerCase()}`
      )
    );
  // update it if exists
  await application.updateOne(
    { status: status ? Status.ACCEPTED : Status.REJECTED },
    { new: true }
  );

  // send email to applicant
  await sendEmail(
    status
      ? acceptanceMail(application.applierId.email)
      : rejectionMail(application.applierId.email)
  );

  // send success response
  return res.status(200).json({
    success: true,
    message: updateApplicationStatusResponse(status),
  });
};

export const getJobApplications = async (req, res, next) => {
  // parse data from request
  const { page, size } = req.query;
  const { jobId } = req.params;

  // check if user is an hr or owner of company
  if (!req.company.HRs.includes(req.user._id))
    return next(new Error(unauthorized, { cause: 401 }));

  // get job with applications
  const job = await Job.findOne(
    { _id: jobId, deletedAt: null },
    {},
    { skip: (page - 1) * size, limit: size, sort: { createdAt: 1 } }
  ).populate([
    {
      path: "applications",
      populate: { path: "applierId", select: hiddenUserSensitiveData },
    },
  ]);

  /**
   * There is no need to check the existence of job because we already did by middleware => 'checkJob'
   */

  // send success response
  return res.status(200).json({ success: true, data: job });
};
