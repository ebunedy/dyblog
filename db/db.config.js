const mongoose = require("mongoose");

const cnonnectDb = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`database connected successfully}`);
  } catch (error) {
    console.log(`Failed to connect to database. ${error}`);
    process.exit(1);
  }
};

module.exports = cnonnectDb;
