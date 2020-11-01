'use strict';

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require('passport');
const { secret } = require('./config');
const Customers = require('../Models/CustModel');
const Restaurants = require('../Models/RestModel');

// Setup work and export for the JWT passport strategy
function auth() {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    secretOrKey: secret,
  };
  passport.use(
    new JwtStrategy(opts, (jwtPayload, callback) => {
      const { cid } = jwtPayload;
      const { rid } = jwtPayload;
      if (cid !== undefined) {
        console.log('cid found');
        Customers.findById(cid, (err, results) => {
          if (err) {
            return callback(err, false);
          }
          if (results) {
            return callback(null, results);
          // eslint-disable-next-line no-else-return
          } else {
            return callback(null, false);
          }
        });
      } else {
        console.log('rid found');
        Restaurants.findById(rid, (err, results) => {
          if (err) {
            console.log('1');
            return callback(err, false);
          }
          if (results) {
            console.log('2');
            return callback(null, results);
          // eslint-disable-next-line no-else-return
          } else {
            console.log('3');
            return callback(null, false);
          }
        });
      }
    }),
  );
}

exports.auth = auth;
exports.checkAuth = passport.authenticate('jwt', { session: false });
