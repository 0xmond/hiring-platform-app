import { GraphQLID } from "graphql";
import * as companyService from "./company.service.js";
import {
  approveCompanyResponse,
  banCompanyResponse,
} from "./company.response.js";

export const companyMutation = {
  banCompany: {
    type: banCompanyResponse,
    args: { id: { type: GraphQLID } },
    resolve: companyService.banCompany,
  },
  approveCompany: {
    type: approveCompanyResponse,
    args: { id: { type: GraphQLID } },
    resolve: companyService.approveCompany,
  },
};
