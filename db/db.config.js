const mongoose = require("mongoose");

const cnonnectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URL_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`database running on ${conn.connection.host}`);
  } catch (error) {
    console.log(`Failed to connect to database. ${error}`);
    process.exit(1);
  }
};

module.exports = cnonnectDb;
