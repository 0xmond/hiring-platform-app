import { Company } from "../../db/models/company.model.js";
import { messages } from "../../utils/messages/index.js";

export const checkCompany = async (req, res, next) => {
  // parse company id from request params
  const { companyId } = req.params;

  // get company
  const company = await Company.findOne({
    _id: companyId,
    deletedAt: null,
  }).populate([{ path: "jobs", match: { deletedAt: null } }]);

  // if company not exists
  if (!company)
    return next(new Error(messages.company.notFound, { cause: 404 }));

  if (!company.approvedByAdmin)
    return next(
      new Error("Wait until admin approve your company", { cause: 401 })
    );

  if (company.bannedAt)
    return next(new Error("This company is banned", { cause: 401 }));

  req.company = company;
  return next();
};
