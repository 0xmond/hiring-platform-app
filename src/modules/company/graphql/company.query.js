import { getAllCompaniesResponse } from "./company.response.js";
import { getAllCompanies } from "./company.service.js";

export const companyQuery = {
  getAllCompanies: { type: getAllCompaniesResponse, resolve: getAllCompanies },
};
