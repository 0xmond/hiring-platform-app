import { Company } from "../../../db/models/company.model.js";
import { isAuthenticate } from "../../../graphql/authentication.js";
import { isAuthorized } from "../../../graphql/authorization.js";
import { isValid } from "../../../graphql/validation.js";
import { Roles } from "../../../utils/enum/index.js";
import { messages } from "../../../utils/messages/index.js";
import * as companyValidation from "./company.validation.js";

export const getAllCompanies = async (_, args, context) => {
  await isAuthenticate(context);
  isAuthorized(Roles.ADMIN, context);

  // get all companies
  const companies = await Company.find().populate([
    { path: "HRs", select: "-password" },
  ]);

  // check if there is no companies
  if (!companies.length)
    throw new Error(messages.company.notFound, { cause: 404 });

  // send success response
  return { success: true, statusCode: 200, data: companies };
};

export const banCompany = async (_, args, context) => {
  await isAuthenticate(context);
  isAuthorized(Roles.ADMIN, context);
  isValid(companyValidation.banCompany, args);

  // update company
  const company = await Company.findOne({ _id: args.id });

  // check existence of company
  if (!company) throw new Error(messages.company.notFound);

  // check if the user is banned or not
  if (company.bannedAt) await company.updateOne({ bannedAt: null });
  else await company.updateOne({ bannedAt: Date.now() });

  return {
    success: true,
    statusCode: 200,
    message: messages.company.updatedSuccessfully,
  };
};

export const approveCompany = async (_, args, context) => {
  await isAuthenticate(context);
  isAuthorized(Roles.ADMIN, context);
  isValid(companyValidation.approveCompany, args);

  // update company
  const company = await Company.findOne({ _id: args.id });

  // check existence of company
  if (!company) throw new Error(messages.company.notFound);

  // check if the user is banned or not
  if (!company.approvedByAdmin)
    await company.updateOne({ approvedByAdmin: true });
  else throw new Error("Company already approved", { cause: 200 });

  return {
    success: true,
    statusCode: 200,
    message: messages.company.updatedSuccessfully,
  };
};
