import { Job } from "../../db/models/job.model.js";
import { messages } from "../../utils/messages/index.js";

const checkJob = async (req, res, next) => {
  // parse job id from request params
  const { jobId } = req.params;

  // get job
  const job = await Job.findOne({
    _id: jobId,
    deletedAt: null,
    companyId: req.company._id,
  });

  // check if job is not exist
  if (!job) return next(new Error(messages.job.notFound, { cause: 404 }));

  req.job = job;

  return next();
};

export default checkJob;
