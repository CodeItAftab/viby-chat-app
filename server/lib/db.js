const mongoose = require("mongoose");
const { MONGO_URI } = require("../config/config");

const connectDB = () => {
  return mongoose
    .connect(MONGO_URI, { dbName: "chatdb" })
    .then((data) => {
      console.log(
        `✅ Database connected successfully: ${data.connection.host}:${data.connection.port}`
      );
    })
    .catch((error) => {
      throw error;
    });
};

module.exports = { connectDB };
