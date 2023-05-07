const mongoose = require('mongoose');

const DBstring = "mongodb://127.0.0.1:27017/DoubtSolve"
mongoose.set('strictQuery',true)

const ConnectToMongo = async () => {
  try {
    await mongoose.connect(DBstring);
    console.log("Connected to database successfully!");
  } catch (error) {
    console.error("Error connecting to database: ", error);
  }
};

module.exports = ConnectToMongo;
