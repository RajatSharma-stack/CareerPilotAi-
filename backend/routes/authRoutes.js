import express from "express";
import {
  signup,
  login,
  sendOtp,
  verifyOtpAndReset,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

// ✅ OTP system routes
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtpAndReset);

export default router;
