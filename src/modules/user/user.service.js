import { User } from "../../db/models/index.js";
import { hiddenUserSensitiveData } from "../../utils/hidden/index.js";
import { messages } from "../../utils/messages/index.js";
import cloudinary from "../../utils/upload/cloudinary.js";
import {
  defaultPublicId,
  defaultSecureUrl,
} from "../../utils/upload/defaults.js";

export const updateUser = async (req, res, next) => {
  // update user
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      ...req.body,
      updatedBy: req.user._id,
    },
    { new: true, fields: hiddenUserSensitiveData }
  ).lean();

  // send success response
  return res.status(200).json({ success: true, data: user });
};

export const getProfile = async (req, res, next) => {
  // parse data from request
  const { id } = req.query;

  // get user
  const user = await User.findOne(
    {
      _id: id ? id : req.user._id,
      deletedAt: null,
    },
    {
      userName: 1,
      mobileNumber: 1,
      profilePic: 1,
      coverPic: 1,
      firstName: 1,
      lastName: 1,
      _id: 0,
    }
  );

  // check user existence
  if (!user) return next(new Error(messages.user.notFound, { cause: 404 }));

  // send success response
  return res.json({ success: true, data: user });
};

export const updatePassword = async (req, res, next) => {
  // parse new password from request body
  const { newPassword } = req.body;

  // update user
  await User.updateOne(
    { _id: req.user._id },
    {
      password: newPassword,
      updatedBy: req.user._id,
      changeCredentialTime: Date.now(),
    }
  );

  // send success response
  return res
    .status(200)
    .json({ success: true, message: "Password changed successfully" });
};

export const updateProfilePic = async (req, res, next) => {
  // upload picture to cloud
  const options = {};

  if (req.user.profilePic.public_id == defaultPublicId)
    options.folder = `/job-search-app/users/${req.user._id}/profile-pic`;
  else options.public_id = req.user.profilePic.public_id;

  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    options
  );

  // save it to database
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      profilePic: {
        secure_url,
        public_id,
      },
      updatedBy: req.user._id,
    },
    {
      new: true,
      fields: hiddenUserSensitiveData,
    }
  ).lean();

  // return success response
  return res.status(200).json({
    success: true,
    message: messages.profilePic.updatedSuccessfully,
    data: user,
  });
};

export const deleteProfilePic = async (req, res, next) => {
  // check if user has the default picture
  if (req.user.profilePic.public_id == defaultPublicId)
    return res.status(200).json({
      success: true,
      message: messages.profilePic.deletedSuccessfully,
    });

  // delete from cloud
  await cloudinary.uploader.destroy(req.user.profilePic.public_id);

  // update user in db
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      profilePic: { public_id: defaultPublicId, secure_url: defaultSecureUrl },
      updatedBy: req.user._id,
    },
    { new: true, fields: hiddenUserSensitiveData }
  ).lean();

  // send success response
  return res.status(200).json({
    success: true,
    message: messages.profilePic.deletedSuccessfully,
    data: user,
  });
};

export const updateCoverPic = async (req, res, next) => {
  // upload picture to cloud
  const options = {};

  if (req.user.coverPic) options.public_id = req.user.coverPic.public_id;
  else options.folder = `/job-search-app/users/${req.user._id}/cover-pic`;

  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    options
  );

  // save it to database
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      coverPic: {
        secure_url,
        public_id,
      },
      updatedBy: req.user._id,
    },
    { new: true, fields: hiddenUserSensitiveData }
  ).lean();

  // return success response
  return res.status(200).json({
    success: true,
    message: messages.coverPic.updatedSuccessfully,
    data: user,
  });
};

export const deleteCoverPic = async (req, res, next) => {
  // check if user has the default picture
  if (!req.user.coverPic)
    return next(new Error(messages.coverPic.notFound, { cause: 404 }));

  // delete from cloud
  await cloudinary.uploader.destroy(req.user.coverPic.public_id);

  // update user in db
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      coverPic: null,
      updatedBy: req.user._id,
    },
    { new: true, fields: hiddenUserSensitiveData }
  ).lean();

  // send success response
  return res.status(200).json({
    success: true,
    message: messages.coverPic.deletedSuccessfully,
    data: user,
  });
};

export const softDeleteAccount = async (req, res, next) => {
  // update user
  await User.updateOne({ _id: req.user._id }, { deletedAt: Date.now() });

  // send success response
  return res.status(200).json({
    success: true,
    message: `${messages.user.deletedSuccessfully}. You can recover your account by login again!`,
  });
};
