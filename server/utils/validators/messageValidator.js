const { body, param } = require("express-validator");
const User = require("./../../models/userModel");
const Chat = require("./../../models/chatModel");
const {
  validatorMiddleware,
} = require("./../../middlewares/validatorMiddleware");

const createMessageValidator = [
  body("chatId")
    .notEmpty()
    .withMessage("chatId field must be specefied")
    .isMongoId()
    .withMessage("chatId field must be a valid MongoDB ID")
    .custom(async (value) => {
      const chat = await Chat.findById(value);
      if (!chat) {
        throw new Error(`Chat with the specified ID: ${value} does not exist`);
      }
      return true;
    }),
  body("senderId")
    .notEmpty()
    .withMessage("senderId field must be specefied")
    .isMongoId()
    .withMessage("senderId field must be a valid MongoDB ID")
    .custom(async (value) => {
      const user = await User.findById(value);
      if (!user) {
        throw new Error(`User with the specified ID: ${value} does not exist`);
      }
      return true;
    }),
  body("text").notEmpty().withMessage("text field must be specefied"),

  validatorMiddleware,
];

const getMessagesValidator = [
  param("chatId")
    .notEmpty()
    .withMessage("chatId param must be specefied")
    .isMongoId()
    .withMessage("chatId param must be a valid MongoDB ID")
    .custom(async (value) => {
      const chat = await Chat.findById(value);
      if (!chat) {
        throw new Error(`Chat with the specified ID: ${value} does not exist`);
      }
      return true;
    }),

  validatorMiddleware,
];

module.exports = {
  createMessageValidator,
  getMessagesValidator,
};
