'use strict';

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require('passport');
const { secret } = require('./config');
const Restaurants = require('../Models/RestModel');

// Setup work and export for the JWT passport strategy
function auth() {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    secretOrKey: secret,
  };
  passport.use(
    new JwtStrategy(opts, (jwtPayload, callback) => {
      const { rid } = jwtPayload;
      Restaurants.findById(rid, (err, results) => {
        if (err) {
          return callback(err, false);
        }
        if (results) {
          return callback(null, results);
        } else {
          return callback(null, false);
        }
      });
    }),
  );
}

exports.auth = auth;
exports.checkAuth = passport.authenticate('jwt', { session: false });
