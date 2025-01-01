const express = require("express");
const { signup, verify, resendOtp, login, logout, forgotPassword, resetPassword, updateUserProfile } = require("../controller/authController.js");
const isAuthenticated = require("../middleware/isAuthenticated");
const router = express.Router()
const {upload, uploadToCloudinary} = require("../middleware/multer");

 router.post("/signup",signup)
 router.post("/verify", isAuthenticated, verify)
 router.post("/resend",isAuthenticated,resendOtp)
 router.post("/login",login)
 router.post("/logout",logout)
 router.post("/forgot-password",forgotPassword)
 router.post("/reset-password",resetPassword)
 router.patch('/update-profile',isAuthenticated, uploadToCloudinary, upload.single('profileImage'), updateUserProfile
  );
 module.exports = router