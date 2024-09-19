const { body, param } = require("express-validator");
const User = require("./../../models/userModel");
const {
  validatorMiddleware,
} = require("./../../middlewares/validatorMiddleware");

const createChatValidator = [
  body("firstId")
    .notEmpty()
    .withMessage("members field must be specefied")
    .isMongoId()
    .withMessage("members field must be a valid MongoDB ID")
    .custom(async (value) => {
      const user = await User.findById(value);
      if (!user) {
        throw new Error(`User with the specified ID: ${value} does not exist`);
      }
      return true;
    }),
  body("secondId")
    .notEmpty()
    .withMessage("members field must be specefied")
    .isMongoId()
    .withMessage("members field must be a valid MongoDB ID")
    .custom(async (value) => {
      const user = await User.findById(value);
      if (!user) {
        throw new Error(`User with the specified ID: ${value} does not exist`);
      }
      return true;
    }),

  validatorMiddleware,
];

const findUserChatsValidator = [
  param("userId")
    .notEmpty()
    .withMessage("userId param must be specefied")
    .isMongoId()
    .withMessage("userId param must be a valid MongoDB ID")
    .custom(async (value) => {
      const user = await User.findById(value);
      if (!user) {
        throw new Error(`User with the specified ID: ${value} does not exist`);
      }
      return true;
    }),

  validatorMiddleware,
];

const findChatValidator = [
  param("firstId")
    .notEmpty()
    .withMessage("firstId param must be specefied")
    .isMongoId()
    .withMessage("firstId param must be a valid MongoDB ID")
    .custom(async (value) => {
      const user = await User.findById(value);
      if (!user) {
        throw new Error(`User with the specified ID: ${value} does not exist`);
      }
      return true;
    }),
  param("secondId")
    .notEmpty()
    .withMessage("secondId param must be specefied")
    .isMongoId()
    .withMessage("secondId param must be a valid MongoDB ID")
    .custom(async (value) => {
      const user = await User.findById(value);
      if (!user) {
        throw new Error(`User with the specified ID: ${value} does not exist`);
      }
      return true;
    }),

  validatorMiddleware,
];

module.exports = {
  createChatValidator,
  findUserChatsValidator,
  findChatValidator,
};
