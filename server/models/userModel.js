const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: [3, "Name is too short"],
      maxlength: [30, "Name is too long"],
    },
    email: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 200,
      unique: [true, "Email is already exists!"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      maxlength: 1024,
    },
    passwordChangedAt: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) {
    return next();
  }

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  // False means NOT chnaged
  return false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
