const MongoStore = require("connect-mongo");

const sessionStore = MongoStore.create({
  mongoUrl: process.env.DB_URL_TEST,
  collection: "sessions",
});

module.exports = sessionStore;
