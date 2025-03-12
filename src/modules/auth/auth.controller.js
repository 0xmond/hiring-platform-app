import { Router } from "express";
import * as authService from "./auth.service.js";
import { asyncHandler } from "../../utils/error/async-handler.js";
import { isValid } from "../../middlewares/validation.middleware.js";
import * as authValidation from "./auth.schema.js";
import rateLimit from "express-rate-limit";

const router = Router();

router.use(
  rateLimit({
    windowMs: 30 * 60 * 1000,
    max: 5,
    message: "Too many attempts. Please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// sign in with google
router.post(
  "/google",
  isValid(authValidation.googleSignIn),
  asyncHandler(authService.googleSignIn)
);

// signup
router.post(
  "/signup",
  isValid(authValidation.signup),
  asyncHandler(authService.signup)
);

// confirm otp
router.post(
  "/confirm",
  isValid(authValidation.confirmOTP),
  asyncHandler(authService.confirmEmail)
);

// login
router.post(
  "/login",
  isValid(authValidation.login),
  asyncHandler(authService.login)
);

// send otp for forget password
router.post(
  "/forget-password",
  isValid(authValidation.forgetPassword),
  asyncHandler(authService.forgetPassword)
);

// reset password
router.put(
  "/reset-password",
  isValid(authValidation.resetPassword),
  asyncHandler(authService.resetPassword)
);

// refresh token
router.post(
  "/refresh-token",
  isValid(authValidation.refreshToken),
  asyncHandler(authService.refreshToken)
);

export default router;
