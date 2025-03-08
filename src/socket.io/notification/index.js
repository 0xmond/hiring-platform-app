import httpProxyClient from "nodemailer/lib/smtp-connection/http-proxy-client.js";
import { Company } from "../../db/models/company.model.js";

export const sendJobApplicationNotification = (socket, io) => {
  return async (data) => {
    // parse data from current socket
    const { companyId, userName } = data;

    // get company
    const company = await Company.findById(companyId);

    // make an array of hr ids
    const HRs = [];
    for (const hr of company.HRs) {
      const hrString = hr.toString();
      HRs.push(hrString);
    }

    // emit notification event for hrs of company
    io.to(HRs).emit("applyForJobNotification", {
      notification: {
        title: "New Application",
        body: `${userName} has applied to your job`,
      },
    });
  };
};
