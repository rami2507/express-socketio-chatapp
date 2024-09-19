const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const jwt = require("jsonwebtoken");
const User = require("./../models/userModel");

exports.protect = asyncHandler(async (req, res, next) => {
  // 1) Get Token and Check If It's Present
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new ApiError("You are not logged in! Please log in to get access.", 401)
    );
  }

  // 2) Validate token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded._id);
  if (!currentUser) {
    return next(
      new ApiError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  // 4) Check if passsword has changed
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new ApiError("User recently changed password! Please login again.", 401)
    );
  }

  // 5) Grant access to the protected route
  req.user = currentUser;
  next();
});
