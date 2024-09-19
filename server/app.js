const express = require("express");
const server = require("./server");
const cors = require("cors");
const dotenv = require("dotenv");
const userRoute = require("./routes/userRoute");
const chatRoute = require("./routes/chatRoute");
const messageRoute = require("./routes/messageRoute");
const ApiError = require("./utils/ApiError");
const {
  globalErrorHandlingMiddleware,
} = require("./middlewares/errorMiddleware");

dotenv.config({ path: "./.env" });

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

app.all("*", (req, res, next) => {
  next(new ApiError(`Invalid route: ${req.originalUrl}`, 404));
});

// INVOKING GLOBAL ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandlingMiddleware);

// HANDLE ERRORS THAT COMES OUT OF EXPRESS
process.on("unhandledRejection", (err) => {
  console.log(`Unhandeled rejection: ${err}`);
  server.close(() => {
    console.error("Shutting Down");
    process.exit(1);
  });
});

module.exports = app;
