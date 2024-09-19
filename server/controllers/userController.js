const User = require("./../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const ApiError = require("./../utils/ApiError");

const createToken = (_id) => {
  const jwtKey = process.env.JWT_SECRET;

  return jwt.sign({ _id }, jwtKey, { expiresIn: "24d" });
};

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

exports.registerUser = asyncHandler(async (req, res) => {
  // Create new user
  let user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  // Hash the password before saving
  user.password = await hashPassword(user.password);

  // Save the user in the database
  await user.save();

  user.password = undefined;

  // Create a token for the user
  const token = createToken(user._id);

  // Send success response with the token and user info
  return res.status(201).json({
    user,
    token,
  });
});

exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // GET FOR THE USER
  const user = await User.findOne({ email });

  // (I HAVE USED THE LOGIC TO CHECK FOR THE EMAIL VALIDATION IN DATABASE USING VALIDATORS TO ENSURE EMAIL IS VALID 100%)

  // CHECKING THE CLIENT PASSWORD
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword)
    return next(new ApiError("Invalid email or password", 400));

  // ASSIGN TOKEN
  const token = createToken(user._id);

  // SEND RESPONSE
  res.status(200).json({
    user,
    token,
  });
});

exports.findUser = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId);

  // VALID USER ID VERIFICATION APPLIED WITH THE VALIDATOR

  res.status(200).json(user);
});

exports.getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  if (user.length === 0) {
    return next(new ApiError("No users has found", 404));
  }
  res.status(200).json(users);
});

exports.updateUserPassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  // Find the user by ID and include the password
  const user = await User.findById(req.user._id).select("password");

  if (!user) {
    return next(new ApiError("Please log in to change your password!", 404));
  }

  // 3) Verify if the current password matches
  const isValidPassword = await bcrypt.compare(currentPassword, user.password);
  if (!isValidPassword) {
    return next(new ApiError("Current password is incorrect!", 400));
  }

  // 4) Hash the new password
  user.password = await hashPassword(newPassword);

  // 5) Save the updated user and update passwordChangedAt
  await user.save();

  res.status(200).json({
    status: "success",
    message: "Password updated successfully!",
  });
});
