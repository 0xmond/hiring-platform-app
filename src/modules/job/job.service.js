import { Job } from "../../db/models/index.js";
import { messages, unauthorized } from "../../utils/messages/index.js";

export const createJob = async (req, res, next) => {
  // check if the user is the owner or hr of the company
  if (
    !req.company.createdBy.equals(req.user._id) &&
    !req.company.HRs.includes(req.user._id)
  )
    return next(new Error(unauthorized, { cause: 401 }));

  // create job
  const job = await Job.create({
    addedBy: req.user._id,
    companyId: req.company._id,
    ...req.body,
  });

  // send success response
  return res.status(201).json({
    success: true,
    message: messages.job.createdSuccessfully,
    data: job,
  });
};

export const updateJob = async (req, res, next) => {
  // parse job id from request params
  const { jobId } = req.params;

  // check if the user is the one who created the job
  if (!req.job.addedBy.equals(req.user._id))
    return next(new Error(unauthorized, { cause: 401 }));

  // update the job
  const job = await Job.findByIdAndUpdate(
    jobId,
    { ...req.body, updatedBy: req.user._id },
    { new: true }
  );

  // send success response
  return res.status(200).json({
    success: true,
    message: messages.job.updatedSuccessfully,
    data: job,
  });
};

export const deleteJob = async (req, res, next) => {
  // parse job id from request params
  const { jobId } = req.params;

  // check if the user is an hr of job company
  if (!req.company.HRs.includes(req.user._id))
    return next(new Error(unauthorized));

  // delete job
  await Job.deleteOne({ _id: jobId });

  // send success response
  return res
    .status(200)
    .json({ success: true, message: messages.job.deletedSuccessfully });
};

export const getJob = async (req, res, next) => {
  // parse job id from request params
  const { id: companyId, jobId } = req.params;
  const { page, size } = req.query;

  // if job id is provided
  if (jobId) {
    // get job
    const job = await Job.findOne({ _id: jobId, deletedAt: null });

    // check if job is not exist
    if (!job) return next(new Error(messages.job.notFound, { cause: 404 }));

    // send success response
    return res.status(200).json({ success: true, data: job });
  }

  // if there is no job id provided, get all jobs for specific company
  const jobs = await Job.find(
    { companyId, deletedAt: null },
    {},
    { limit: size, skip: (page - 1) * size, sort: { createdAt: 1 } }
  );

  // if there is no jobs for this company
  if (!jobs.length)
    return next(new Error(messages.job.notFound, { cause: 404 }));

  // send success response
  return res
    .status(200)
    .json({ success: true, totalCount: jobs.length, data: jobs });
};

export const searchJob = async (req, res, next) => {
  // parse search terms from request
  const { page, size, jobTitle } = req.query;

  const { workingTime, jobLocation, seniorityLevel, technicalSkills } =
    req.body;

  const query = { deletedAt: null };

  if (jobTitle) query.jobTitle = { $regex: jobTitle };
  if (workingTime) query.workingTime = { $in: workingTime };
  if (jobLocation) query.jobLocation = { $in: jobLocation };
  if (seniorityLevel) query.seniorityLevel = { $in: seniorityLevel };
  if (technicalSkills) query.technicalSkills = { $in: technicalSkills };

  // get jobs
  const jobs = await Job.find(
    query,
    {},
    { limit: size, skip: (page - 1) * size, sort: { createdAt: 1 } }
  );

  // if there is no jobs for this company
  if (!jobs.length)
    return next(new Error(messages.job.notFound, { cause: 404 }));

  // send success response
  return res
    .status(200)
    .json({ success: true, totalCount: jobs.length, data: jobs });
};
