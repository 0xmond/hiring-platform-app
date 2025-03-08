import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      // credentials
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
    tls: {
      rejectUnauthorized: false, // to skip SSL verfication
    },
  });

  // check if email is sent
  const info = await transporter.sendMail({
    from: `"Hiro"<${process.env.EMAIL}>`,
    to,
    subject,
    html,
  });

  return info.rejected.length > 0 ? false : true;
};
