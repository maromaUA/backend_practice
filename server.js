const app = require("./app");
const mongoose = require("mongoose");
const DB_HOST =
  "mongodb+srv://maroma1991:QAZ123wsx@cluster0.askrqto.mongodb.net/db-contacts?retryWrites=true&w=majority";
mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(3000, () => {
      console.log("Server running. Use our API on port: 3000");
    });
    console.log("Database connection successful");
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
