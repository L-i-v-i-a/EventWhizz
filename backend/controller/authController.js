const catchAsync = require("../utils/catchAsync");
const generateOtp = require("../utils/generateOtp");
const jwt = require("jsonwebtoken");
const { User } = require("../model/userModel");
const sendEmail = require("../utils/email");
const AppError = require("../utils/appError"); 



const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN * 20 * 60 * 60 * 1000,
  });
};

const createSendToken = (user, statusCode, res, message) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", 
    sameSite: process.env.NODE_ENV === "production" ? "none" : "Lax",
  };
  res.cookie("token", token, cookieOptions);
  user.password = undefined;
  user.passwordConfirm = undefined;
  user.otp = undefined;

  res.status(statusCode).json({
    status: "success",
    message,
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { name, username, email, password, passwordConfirm } = req.body;


  if (!name || !username || !email || !password || !passwordConfirm) {
    return next(new AppError("Missing required fields", 400));
  }

 
  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    return next(new AppError("Username has been taken, please choose another", 400));
  }


  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError("Email already registered", 400));
  }


  const otp = generateOtp();


  const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes


  const newUser = await User.create({
    name,
    username,
    email,
    password,
    passwordConfirm,
    otp,
    otpExpires,
  });

  console.log("New user created:", newUser);


  try {
    await sendEmail({
      email: newUser.email,
      subject: "OTP for Email Verification",
      html: `
        <h1>Welcome ${username}</h1>
        <p>Please verify your email. If you did not request this, ignore this email.</p>
        <p>Do not share this verification code with anyone.</p>
        <h1>Your OTP is: ${otp}</h1>
      `,
    });

    console.log("OTP email sent successfully to:", newUser.email);

    createSendToken(newUser, 201, res, "Registration successful");
  } catch (error) {
    console.error("Error while sending email:", error);
    await User.findByIdAndDelete(newUser._id); 
    return next(
      new AppError("There was an error in the registration process. Please try again.", 500)
    );
  }
});

exports.verify = catchAsync(async(req,res,next)=>{
  const {otp} = req.body

  if(!otp){
    return next (new AppError("Enter OTP",400))
  }
  const user = req.user;

  if(user.otp !== otp){
    return next(new AppError("Invaild OTP",400))
  }

  if(Date.now() > user.otpExpires){
    return next (new AppError("Otp has expired. Please request a new OTP", 400));
  }
  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;

  await user.save({validateBeforeSave:false})

  createSendToken(user,200,res,"Email has been verified")
});

exports.resendOtp = catchAsync(async (req, res, next) => {
  const { email } = req.user;

  if (!email) {
    return next(new AppError('Email is required to resend OTP', 400));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  if (user.isVerified) {
    return next(new AppError('This account is already verified', 400));
  }

  const newOtp = generateOtp();
  user.otp = newOtp;
  user.otpExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  await user.save({ validateBeforeSave: false });

  try {
    await sendEmail({
      email: user.email,
      subject: 'Resent OTP for Email Verification',
      html: `
        <h1>Welcome ${user.name || 'User'}</h1>
        <p>Please verify your email. If you did not request this, ignore this email.</p>
        <p>Do not share this verification code with anyone.</p>
        <h1>Your OTP is: ${newOtp}</h1>
      `,
    });

    res.status(200).json({
      status: 'success',
      message: 'A new OTP has been sent to your email',
    });
  } catch (error) {
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Please try again later.', 500)
    );
  }
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const user = await User.findOne({ email }).select("password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect Email or password"));
  }

  
  createSendToken(user, 200, res, "Login Successfully");
});

exports.logout = catchAsync(async (req, res, next) => {
  res.cookie("token", "loggedout", {
    expires: new Date(Date.now() + 10 * 10000), 
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({
    status: "success",
    message: "logged out successfully", 
  });
});


exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError("Please provide a valid email", 400));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("No user found with that email", 404));
  }

  const otp = generateOtp();

  user.resetPasswordOTP = otp;
  user.resetPasswordOTPExpires = Date.now() + 5 * 60 * 1000; // 5 minutes

  await user.save({ validateBeforeSave: false });

  try {
    await sendEmail({
      email: user.email,
      subject: "OTP for Reset Password",
      html: `
        <h1>Hello ${user.name || 'User'}</h1>
        <p>You requested to reset your password. Please use the OTP below to proceed. If you did not make this request, you can safely ignore this email.</p>
        <p><strong>Do not share this OTP with anyone.</strong></p>
        <p>This OTP will expire in 5 minutes.</p>
        <h2>Your reset OTP: <strong>${otp}</strong></h2>
      `,
    });

    res.status(200).json({
      status: 'success',
      message: 'A reset OTP has been sent to your email',
    });
  } catch (error) {
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError("There was an error sending the email. Please try again later.", 500)
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { email, otp, password, passwordConfirm } = req.body;

  if (!email || !otp || !password || !passwordConfirm) {
    return next(new AppError("Please provide all required fields", 400));
  }

  if (password !== passwordConfirm) {
    return next(new AppError("Passwords do not match", 400));
  }


  const user = await User.findOne({
    email,
    resetPasswordOTP: otp,
    resetPasswordOTPExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new AppError(
        "Invalid OTP or OTP has expired. Please request a new one.",
        400
      )
    );
  }

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.resetPasswordOTP = undefined;
  user.resetPasswordOTPExpires = undefined;

  await user.save();

  createSendToken(user, 200, res, "Password was reset successfully");
});


exports.updateUserProfile = catchAsync(async (req, res, next) => {
  const { name, username, email } = req.body;

  // Check for duplicate username or email
  if (username || email) {
    const duplicateUser = await User.findOne({
      $or: [{ username }, { email }],
      _id: { $ne: req.user._id },
    });

    if (duplicateUser) {
      return next(
        new AppError('Username or email is already in use by another user', 400)
      );
    }
  }
  const profileImage = req.file ? req.file.path : undefined;

  // Update user data
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { name, username, email, ...(profileImage && { profileImage }) },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Profile updated successfully',
    data: {
      user: updatedUser,
    },
  });
});
