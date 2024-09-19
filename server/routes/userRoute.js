const express = require("express");
const {
  registerUser,
  loginUser,
  findUser,
  getUsers,
  updateUserPassword,
} = require("./../controllers/userController");

const { protect } = require("./../controllers/protect");

const {
  registerUserValidator,
  loginUserValidator,
  findUserValidator,
  updatePasswordValidator,
} = require("./../utils/validators/userValidator");

const router = express.Router();

router.post("/register", registerUserValidator, registerUser);
router.post("/login", loginUserValidator, loginUser);
router.patch("/update", protect, updatePasswordValidator, updateUserPassword);
router.get("/find/:userId", protect, findUserValidator, findUser);
router.get("/", getUsers);

module.exports = router;
