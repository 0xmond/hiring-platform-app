import { User } from "../../db/models/user.model.js";
import randomstring from "randomstring";
import {
  EMAIL_SUBJECTS,
  OTP_TYPE,
  Providers,
  Roles,
} from "../../utils/enum/index.js";
import { sendEmail } from "../../utils/email/send-email.js";
import { messages } from "../../utils/messages/index.js";
import { compare } from "../../utils/hash/compare.js";
import { generateToken } from "../../utils/token/generate-token.js";
import { generateOTP } from "../../utils/otp/generate-otp.js";
import { hash } from "../../utils/hash/hash.js";
import { verifyToken } from "../../utils/token/verify-token.js";
import { OAuth2Client } from "google-auth-library";

export const googleSignIn = async (req, res, next) => {
  // parse google token from request body
  const { token } = req.body;

  // create OAuth client
  const client = new OAuth2Client();

  // verify token with google
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID,
  });

  // extract data from payload if it's true
  const payload = ticket.getPayload();

  // check if token is invalid
  if (!payload) return next(new Error("Invalid id token", { cause: 400 }));

  // destruct required data from payload
  const { email, picture, given_name, family_name } = payload;

  // check if user exist
  let user = await User.findOneAndUpdate(
    { email },
    { deletedAt: null },
    { new: true }
  );

  if (!user)
    user = await User.create({
      firstName: given_name,
      lastName: family_name,
      email,
      profilePic: { secure_url: picture },
      provider: Providers.GOOGLE,
      isConfirmed: true,
    });

  // generate access and refresh token
  const accessToken = generateToken({ _id: user.id, email }, "1h");
  const refreshToken = generateToken({ _id: user.id, email }, "7d");

  // send success response
  return res
    .status(200)
    .json({ success: true, data: { accessToken, refreshToken } });
};

export const signup = async (req, res, next) => {
  // parse request data
  const { firstName, lastName, email, password, gender, mobileNumber } =
    req.body;

  // generate otp
  const otp = generateOTP();
  // create user
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    gender,
    otp: [
      {
        code: hash(otp),
        otpType: OTP_TYPE.SEND_EMAIL,
        expiresIn: new Date(Date.now() + 60 * 60 * 1000), // expires in 1 hour
      },
    ],
    provider: Providers.SYSTEM,
  });

  // // send email with otp
  await sendEmail({
    to: email,
    subject: EMAIL_SUBJECTS.EMAIL_CONFIRMATION,
    html: `<h1>Thanks for trusting us</h1><br><p>Your OTP: ${otp}</p>`,
  });

  // send success response
  return res
    .status(201)
    .json({ success: true, message: messages.user.createdSuccessfully });
};

export const confirmEmail = async (req, res, next) => {
  // parse otp from request body
  const { otp, email } = req.body;

  // find user with provided email
  const user = await User.findOne({ email });

  // check if user not exist
  if (!user) return next(new Error(messages.user.notFound, { cause: 400 }));

  // confirm otp
  const isValidOTP = confirmOTP(user, otp, OTP_TYPE.SEND_EMAIL);
  if (!isValidOTP) return next(new Error("Invalid OTP", { cause: 400 }));

  // confirm user
  await user.updateOne({
    isConfirmed: true,
    $pull: {
      otp: { code: otp },
    },
  });

  // send success response
  return res
    .status(200)
    .json({ success: true, message: "User is confirmed successfully" });
};

export const login = async (req, res, next) => {
  // parse request data
  const { email, password } = req.body;

  // find user
  const user = await User.findOneAndUpdate(
    { email },
    { deletedAt: null },
    { new: true }
  );

  // if user not exist
  if (!user)
    return next(new Error("Email or password is wrong", { cause: 400 }));

  // compare user password with provided password
  const result = compare({ data: password, hashedData: user.password });

  // if password is wrong
  if (!result)
    return next(new Error("Email or password is wrong", { cause: 400 }));

  // generate access token and refresh token
  const accessToken = generateToken({ _id: user.id, email }, "1h");
  const refreshToken = generateToken({ _id: user.id, email }, "7d");

  // send success response
  return res
    .status(200)
    .json({ success: true, data: { accessToken, refreshToken } });
};

export const forgetPassword = async (req, res, next) => {
  // parse email from request body
  const { email } = req.body;

  // find user
  const user = await User.findOne({ email });

  // check if user exists
  if (!user) return next(new Error(messages.user.notFound, { cause: 400 }));

  // generate otp
  const otp = generateOTP();

  // send otp to user (email)
  await sendEmail({
    to: email,
    subject: EMAIL_SUBJECTS.RESET_PASSWORD,
    html: `<h1>Thanks for trusting us</h1><br><p>Your OTP: ${otp}</p>`,
  });

  await user.updateOne({
    $push: {
      otp: {
        code: otp,
        otpType: OTP_TYPE.FORGET_PASSWORD,
        expiresIn: new Date(Date.now() + 60 * 60 * 1000), // expires in 1 hour
      },
    },
  });

  // send success response
  return res.status(200).json({
    success: true,
    message: "OTP is sent successfully, please check your inbox",
  });
};

export const resetPassword = async (req, res, next) => {
  // parse email, otp and new password from request
  const { email, otp, newPassword } = req.body;

  // find user
  const user = await User.findOne({ email });

  // check user existence
  if (!user) return next(new Error(messages.user.notFound, { cause: 400 }));

  // confirm otp
  const isValidOTP = confirmOTP(user, otp, OTP_TYPE.FORGET_PASSWORD);
  if (!isValidOTP) return next(new Error("Invalid OTP", { cause: 400 }));

  // update user password
  await user.updateOne({
    password: hash(newPassword),
    $pull: {
      otp: { code: otp },
    },
  });

  // send success response
  return res.status(200).json({
    success: true,
    message: messages.user.updatedSuccessfully,
  });
};

export const refreshToken = async (req, res, next) => {
  // parse refresh token from request body
  const { refreshToken } = req.body;

  // verify refresh token
  const payload = verifyToken({ token: refreshToken });

  // check if token is valid
  if (payload.error)
    return next(new Error(payload.error.message, { cause: 400 }));

  // generate access token
  const accessToken = generateToken({ _id: payload._id, email: payload.email });

  // send success response
  return res
    .status(200)
    .json({ success: true, data: { accessToken, refreshToken } });
};

const confirmOTP = (user, otp, otpType) => {
  if (
    !user.otp.some(
      (o) =>
        compare({ data: otp, hashedData: o.code }) &&
        new Date(o.expiresIn) > new Date() &&
        o.otpType == otpType
    )
  ) {
    return false;
  }
  return true;
};
