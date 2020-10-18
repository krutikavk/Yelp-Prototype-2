'use strict';

const { JwtStrategy } = require('passport-jwt');
const { ExtractJwt } = require('passport-jwt');
const passport = require('passport');
const { secret } = require('./config');
const Customers = require('../Models/CustModel');

// Setup work and export for the JWT passport strategy
function auth() {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    secretOrKey: secret,
  };
  passport.use(
    new JwtStrategy(opts, (jwtPayload, callback) => {
      const { cid } = jwtPayload;
      Customers.findById(cid, (err, results) => {
        if (err) {
          return callback(err, false);
        }
        if (results) {
          callback(null, results);
        } else {
          callback(null, false);
        }
      });
    }),
  );
}

exports.auth = auth;
exports.checkAuth = passport.authenticate('jwt', { session: false });
