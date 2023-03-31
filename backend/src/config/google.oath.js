require("dotenv").config();
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const passport=require("passport");
const User=require("../models/user.model");
const { v4:uuidv4 }= require('uuid');

passport.use(new GoogleStrategy({
    clientID: "810375227477-46u1erma7dhojth9stoi6ifkt5a7lmld.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:2345/auth/google/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
      console.log(profile);
      let user=User.findOne({email:profile?.email}).lean().exec();

      if(!user)
      user=User.create({
          email:"profile?.email",
          password:uuidv4(),
      });
      
      user={name:profile?.displayName,email:profile?.email}
      return done(null,user)
  }
));

module.exports=passport;