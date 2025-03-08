import { Types } from "mongoose";
import { Application, Company, User } from "../../db/models/index.js";
import { Roles } from "../../utils/enum/index.js";
import { messages, unauthorized } from "../../utils/messages/index.js";
import cloudinary from "../../utils/upload/cloudinary.js";
import {
  defaultPublicId,
  defaultSecureUrl,
} from "../../utils/upload/defaults.js";
import XLSX from "xlsx";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

export const createCompany = async (req, res, next) => {
  // parse data from request
  const { companyName, companyEmail } = req.body;

  // check if the email or name already exists
  let company = await Company.findOne({
    $or: [{ companyEmail }, { companyName }],
  });

  if (company)
    return next(new Error(messages.company.alreadyExist, { cause: 409 }));

  // upload legal attachment to cloud
  const companyId = new Types.ObjectId();

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `/job-search-app/companies/${companyId}/legal-attachment`,
    }
  );

  // create company
  company = await Company.create({
    _id: companyId,
    companyName,
    companyEmail,
    legalAttachment: { secure_url, public_id },
    HRs: [req.user._id],
    createdBy: req.user._id,
  });

  // send success response
  return res.status(201).json({
    success: true,
    message: messages.company.createdSuccessfully,
    data: company,
  });
};

export const updateCompany = async (req, res, next) => {
  // parse company id from request params
  const { companyId } = req.params;

  if (!req.company.createdBy.equals(req.user._id))
    return next(new Error(unauthorized, { cause: 401 }));

  // parse data from request body
  const {
    HRs,
    companyName,
    description,
    industry,
    address,
    numberOfEmployees,
  } = req.body;

  // to add hr users by their email
  if (HRs) {
    var hrUsers = await User.find({ email: { $in: HRs } });
    var hrUsersIds = hrUsers.map((user) => user._id);
  }

  // update company
  await Company.updateOne(
    { _id: companyId },
    {
      companyName,
      description,
      industry,
      address,
      numberOfEmployees,
      $addToSet: {
        HRs: hrUsersIds,
      },
    },
    { new: true }
  );

  // return success response
  return res.status(200).json({ success: true, data: company });
};

export const softDeleteCompany = async (req, res, next) => {
  // parse company id from request params
  const { companyId } = req.params;

  // check if the logged in user is not the owner nor admin
  if (req.user.role != Roles.ADMIN && !company.createdBy.equals(req.user._id))
    return next(new Error(unauthorized, { cause: 401 }));

  // soft delete company
  await Company.updateOne({ _id: companyId }, { deletedAt: Date.now() });

  // return success response
  return res
    .status(200)
    .json({ success: true, message: messages.company.deletedSuccessfully });
};

export const getCompanyJobs = async (req, res, next) => {
  // send success response
  return res.status(200).json({ success: true, data: req.company });
};

// bonus
export const getJobApplicationsInSpecificDay = async (req, res, next) => {
  // parse date from request body
  const { date } = req.body;

  // set day start and end
  const startOfDay = new Date(`${date}T00:00:00.000Z`).getTime();
  const endOfDay = new Date(`${date}T23:59:59.999Z`).getTime();

  // get applications for specific company in specific day
  const applications = await Application.aggregate([
    {
      $lookup: {
        from: "jobs",
        localField: "jobId",
        foreignField: "_id",
        as: "job",
      },
    },
    { $unwind: "$job" },
    {
      $match: {
        "job.companyId": new Types.ObjectId(req.company._id),
        createdAt: {
          $gte: new Date(startOfDay),
          $lte: new Date(endOfDay),
        },
      },
    },
    {
      $project: {
        jobId: 1,
        applierId: 1,
        userCV: 1,
        status: 1,
        createdAt: 1,
      },
    },
  ]);

  if (!applications.length)
    return next(new Error(messages.application.notFound, { cause: 404 }));

  const excelData = applications.map((app) => ({
    Application_ID: app._id.toString(),
    Job_ID: app.jobId.toString(),
    Applier_ID: app.applierId.toString(),
    CV_Link: app.userCV.secure_url,
    Status: app.status,
    Created_At: new Date(app.createdAt).toLocaleString(),
  }));

  // convert data to worksheet
  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Applications");

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const filePath = path.join(__dirname, `./${date}.xlsx`);

  if (!fs.existsSync(path.dirname(filePath))) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
  }

  // write data to excel sheet
  XLSX.writeFile(workbook, filePath);

  // upload cv to cloud
  const { secure_url } = await cloudinary.uploader.upload(filePath, {
    folder: `/job-search-app/companies/${req.company._id}/applications`,
    public_id: `${date}`,
    resource_type: "raw",
  });

  fs.unlinkSync(filePath);

  return res.json({
    success: 200,
    message: `Download it from here: ${secure_url}`,
  });
};

export const searchAboutCompany = async (req, res, next) => {
  // parse company name from request query
  const { search } = req.query;

  // get companies that contains search keyword
  if (search)
    var companies = await Company.find({
      $where: function () {
        return this.companyName.includes(search);
      },
      deletedAt: null,
      approvedByAdmin: true,
    });
  else var companies = await Company.find({ deletedAt: null });

  // check if there is no companies found
  if (!companies.length)
    return next(new Error(messages.company.notFound, { cause: 404 }));

  // send success response
  return res.status(200).json({ success: true, data: companies });
};

export const updateLogo = async (req, res, next) => {
  // parse company id from request params
  const { companyId } = req.params;

  // check if the logged in user is not the owner nor admin
  if (!req.company.createdBy.equals(req.user._id))
    return next(new Error(unauthorized, { cause: 401 }));

  // upload picture to cloud
  const options = {};

  if (req.company.logo.public_id == defaultPublicId)
    options.folder = `/job-search-app/companies/${companyId}/logo`;
  else options.public_id = req.company.logo.public_id;

  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    options
  );

  // save it to database
  const company = await Company.findOneAndUpdate(
    { _id: companyId },
    {
      logo: {
        secure_url,
        public_id,
      },
    },
    { new: true }
  ).lean();

  // return success response
  return res.status(200).json({
    success: true,
    message: messages.logo.updatedSuccessfully,
    data: company,
  });
};

export const deleteLogo = async (req, res, next) => {
  // parse company id from request params
  const { companyId } = req.params;

  // check if the logged in user is not the owner nor admin
  if (!req.company.createdBy.equals(req.user._id))
    return next(new Error(unauthorized, { cause: 401 }));

  // check if company has the default picture
  if (req.company.logo.public_id == defaultPublicId)
    return res.status(200).json({
      success: true,
      message: messages.logo.deletedSuccessfully,
    });

  // delete from cloud
  await cloudinary.uploader.destroy(req.company.logo.public_id);

  // update user in db
  const company = await Company.updateOne(
    { _id: companyId },
    {
      logo: { public_id: defaultPublicId, secure_url: defaultSecureUrl },
    },
    { new: true }
  );

  // send success response
  return res.status(200).json({
    success: true,
    message: messages.logo.deletedSuccessfully,
  });
};

export const updateCoverPic = async (req, res, next) => {
  // parse company id from request params
  const { companyId } = req.params;

  // check if the logged in user is not the owner nor admin
  if (!req.company.createdBy.equals(req.user._id))
    return next(new Error(unauthorized, { cause: 401 }));

  // upload picture to cloud
  const options = {};

  if (req.company.coverPic) options.public_id = req.company.coverPic.public_id;
  else options.folder = `/job-search-app/companies/${companyId}/cover-pic`;

  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    options
  );

  // save it to database
  const company = await Company.updateOne(
    { _id: req.user._id },
    {
      coverPic: {
        secure_url,
        public_id,
      },
    },
    { new: true }
  ).lean();

  // return success response
  return res.status(200).json({
    success: true,
    message: messages.coverPic.updatedSuccessfully,
    data: company,
  });
};

export const deleteCoverPic = async (req, res, next) => {
  // parse company id from request params
  const { companyId } = req.params;

  // check if the logged in user is not the owner nor admin
  if (!req.company.createdBy.equals(req.user._id))
    return next(new Error(unauthorized, { cause: 401 }));

  // check if user has the default picture
  if (!req.company.coverPic)
    return next(new Error(messages.coverPic.notFound, { cause: 404 }));

  // delete from cloud
  await cloudinary.uploader.destroy(req.company.coverPic.public_id);

  // update user in db
  await Company.updateOne(
    { _id: companyId },
    {
      coverPic: null,
    },
    { new: true }
  );

  // send success response
  return res.status(200).json({
    success: true,
    message: messages.coverPic.deletedSuccessfully,
  });
};
