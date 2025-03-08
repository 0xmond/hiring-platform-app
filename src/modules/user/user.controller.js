import { Router } from "express";
import { isAuthenticate } from "../../middlewares/authentication.middleware.js";
import { asyncHandler } from "../../utils/error/async-handler.js";
import { isValid } from "../../middlewares/validation.middleware.js";
import { getProfile, updatePassword, updateUser } from "./user.schema.js";
import * as userService from "./user.service.js";
import { isAuthorized } from "../../middlewares/authorization.middleware.js";
import { fileFormats, uploadFile } from "../../utils/upload/multer.js";
import { uploadSingleValidation } from "../../utils/upload/single.validation.js";
import { Roles } from "../../utils/enum/index.js";

const router = Router();

// authentication and authorization
router.use(asyncHandler(isAuthenticate), isAuthorized([Roles.USER]));

// update user profile
router.put("/", isValid(updateUser), asyncHandler(userService.updateUser));

// get user profile
router.get(
  "/profile",
  isValid(getProfile),
  asyncHandler(userService.getProfile)
);

// update password
router.patch(
  "/update-password",
  isValid(updatePassword),
  asyncHandler(userService.updatePassword)
);

// update profile picture
router.post(
  "/profile-pic",
  uploadFile(fileFormats.images).single("attachment"),
  isValid(uploadSingleValidation),
  asyncHandler(userService.updateProfilePic)
);

// delete profile picture
router.delete("/profile-pic", asyncHandler(userService.deleteProfilePic));

// update cover
router.post(
  "/cover-pic",
  uploadFile(fileFormats.images).single("attachment"),
  isValid(uploadSingleValidation),
  asyncHandler(userService.updateCoverPic)
);

// delete cover
router.delete("/cover-pic", asyncHandler(userService.deleteCoverPic));

// soft delete account
router.delete("/delete-account", asyncHandler(userService.softDeleteAccount));

export default router;
