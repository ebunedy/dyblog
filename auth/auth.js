const localStrategy = require("passport-local").Strategy;
const passport = require("passport");
const User = require("../models/user.model");

passport.use(
  "login",
  new localStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, {
            message: "user not found. please register",
          });
        }
        const isPasswordValid = await user.comparePasswords(password);
        if (!isPasswordValid) {
          return done(null, false, {
            message: "incorrect password",
          });
        }
        return done(null, user, {
          message: "user logged in successfully",
        });
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (userid, done) => {
  try {
    const user = await User.findById(userid);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
