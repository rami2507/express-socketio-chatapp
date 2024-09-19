const { body, param } = require("express-validator");
const User = require("./../../models/userModel");
const {
  validatorMiddleware,
} = require("./../../middlewares/validatorMiddleware");

const registerUserValidator = [
  body("name")
    .notEmpty()
    .withMessage("name field must be specefied")
    .isLength({ min: 3 })
    .withMessage("Name is too short")
    .isLength({ max: 30 })
    .withMessage("Name is too long"),
  body("email")
    .notEmpty()
    .withMessage("email field must be specefied")
    .isEmail()
    .withMessage("Please use a valid email address")
    .custom(async (email) => {
      const userExists = await User.exists({ email });
      if (userExists) {
        throw new Error(
          `User with the specified email: ${email} already exists`
        );
      }
      return true;
    }),
  body("password")
    .notEmpty()
    .withMessage("password field must be specefied")
    .isLength({ min: 6 })
    .withMessage("Password is too short")
    .isLength({ max: 1024 })
    .withMessage("Password is too long")
    .isStrongPassword()
    .withMessage("Your password is too weak!"),

  validatorMiddleware,
];

const loginUserValidator = [
  body("email")
    .notEmpty()
    .withMessage("email field must be specefied")
    .isEmail()
    .withMessage("Please use a valid email address")
    .custom(async (email) => {
      const userExists = await User.exists({ email });
      if (!userExists) {
        throw new Error(`Incorrect email or password!`);
      }
      return true;
    }),
  body("password").notEmpty().withMessage("password field must be specefied"),

  validatorMiddleware,
];

const findUserValidator = [
  param("userId")
    .notEmpty()
    .withMessage("userId param must be specefied")
    .isMongoId()
    .withMessage("userId param must be a valid MongoDB ID")
    .custom(async (value) => {
      const userExists = await User.exists({ _id: value });
      if (!userExists) {
        throw new Error(`User with the specified ID: ${value} does not exist`);
      }
      return true;
    }),

  validatorMiddleware,
];

const updatePasswordValidator = [
  body("currentPassword")
    .notEmpty()
    .withMessage("currentPassword field must be specefied"),
  body("newPassword")
    .notEmpty()
    .withMessage("newPassword field must be specefied"),
  validatorMiddleware,
];

module.exports = {
  registerUserValidator,
  loginUserValidator,
  findUserValidator,
  updatePasswordValidator,
};
