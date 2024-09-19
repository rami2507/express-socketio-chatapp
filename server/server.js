const mongoose = require("mongoose");
const app = require("./app");

// CONNECTING MONGOOSE
mongoose
  .connect(process.env.ATLAS_URI)
  .then(() => console.log("DB has been connected successfuly"))
  .catch((err) => console.error(err.message));

// STARTING THE SERVER
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = server;
