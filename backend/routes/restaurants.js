const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { mongoDB, secret } = require('../Utils/config');
const { checkAuth, auth } = require('../Utils/passport');
const Restaurants = require('../Models/RestModel');

auth();

const router = express.Router();

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  poolSize: 500,
  bufferMaxEntries: 0,
};

// eslint-disable-next-line no-unused-vars
mongoose.connect(mongoDB, options, (err, res) => {
  if (err) {
    console.log(err);
    console.log('MongoDB Connection Failed');
  } else {
    console.log('MongoDB Connected');
  }
});

// get all restaurants
router.get('/', (request, response) => {
  console.log('Hit get all restaurants');
  Restaurants.find({}, (error, results) => {
    if (error) {
      response.writeHead(400, {
        'Content-Type': 'text/plain',
      });
      response.end('Error fetching restaurants');
    } else {
      console.log('Sending 200');
      response.writeHead(200, {
        'Content-Type': 'application/json',
      });
      response.end(JSON.stringify(results));
    }
  });
});

// Get one restaurant
router.get('/:rid', (request, response) => {
  console.log('\nEndpoint GET: Get a restaurant');
  Restaurants.findById(request.params.rid, (error, restaurant) => {
    if (error) {
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      console.log('Error in finding restaurant with ID');
      response.end('Error in finding restaurant with ID');
    } else if (restaurant) {
      console.log('Sending 200');
      response.writeHead(200, {
        'Content-Type': 'application/json',
      });
      response.end(JSON.stringify(restaurant));
    } else {
      response.writeHead(400, {
        'Content-Type': 'text/plain',
      });
      console.log('Restaurant not found');
      response.end('Restaurant not found');
    }
  });
});

// Sign up
router.post('/', (request, response) => {
  console.log('\nEndpoint POST: restaurant signup');
  console.log('Req Body: ', request.body);

  bcrypt.hash(request.body.rpassword, 10, (errHash, hash) => {
    const newRestaurant = new Restaurants({
      remail: request.body.remail,
      rpassword: hash,
      rname: request.body.rname,
    });
    Restaurants.findOne({ remail: request.body.remail }, (error, restaurant) => {
      if (error) {
        response.writeHead(500, {
          'Content-Type': 'text/plain',
        });
        console.log('Error in finding restaurant');
        response.end('Error in finding restaurant');
      } else if (restaurant) {
        response.writeHead(400, {
          'Content-Type': 'text/plain',
        });
        console.log('Email ID already registered');
        response.end('Email ID already registered');
      } else {
        newRestaurant.save((err) => {
          if (err) {
            response.writeHead(500, {
              'Content-Type': 'text/plain',
            });
            console.log('Error in saving new restaurant');
            response.end('Error in saving new restaurant');
          } else {
            console.log('Successfully added restaurant to database');
            // return the restaurant object back
            Restaurants.findOne({ remail: request.body.remail }, (e, rest) => {
              if (e) {
                response.writeHead(500, {
                  'Content-Type': 'text/plain',
                });
                console.log('Error in finding restaurant with email ID');
                response.end('Error in finding restaurant with email ID');
              } else if (rest) {
                const payload = {
                  // eslint-disable-next-line no-underscore-dangle
                  remail: rest.remail,
                  rpassword: rest.rpassword,
                  rname: rest.rname,
                  rphone: rest.rphone,
                  rabout: rest.rabout,
                  rphoto: [...rest.rphoto],
                  rlatitude: rest.rlatitude,
                  rlongitude: rest.rlatitude,
                  raddress: rest.raddress,
                  rcuisine: rest.rcuisine,
                  rdelivery: rest.rdelivery,
                  rdish: [...rest.rdish],
                  rhours: rest.hours,
                  rrating: rest.rrating,
                  revents: [...rest.revents],
                };
                const token = jwt.sign(payload, secret, {
                  expiresIn: 1008000,
                });
                console.log('Login successful token:', token);
                response.status(200).end(`JWT ${token}`);
              } else {
                response.writeHead(500, {
                  'Content-Type': 'text/plain',
                });
                console.log('Restaurant not found');
                response.end('Restaurant not found');
              }
            });
          }
        });
      }
    });
  });
});

// Login
router.post('/login', (request, response) => {
  console.log('\nEndpoint POST: Restaurant login');
  console.log('Req Body: ', request.body);
  Restaurants.findOne({ remail: request.body.remail }, (error, restaurant) => {
    if (error) {
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      console.log('Error in finding restaurant with email ID');
      response.end('Error in finding restaurant with email ID');
    } else if (restaurant) {
      bcrypt.compare(request.body.rpassword, restaurant.rpassword, (err, result) => {
        console.log('in db: ', restaurant.rpassword);
        if (result === true) {
          const payload = {
          // eslint-disable-next-line no-underscore-dangle
            rid: restaurant._id,
            remail: restaurant.remail,
            rpassword: restaurant.rpassword,
            rname: restaurant.rname,
            rphone: restaurant.rphone,
            rabout: restaurant.rabout,
            rphoto: [...restaurant.rphoto],
            rlatitude: restaurant.rlatitude,
            rlongitude: restaurant.rlatitude,
            raddress: restaurant.raddress,
            rcuisine: restaurant.rcuisine,
            rdelivery: restaurant.rdelivery,
            rdish: [...restaurant.rdish],
            rhours: restaurant.hours,
            rrating: restaurant.rrating,
            revents: [...restaurant.revents],
          };
          const token = jwt.sign(payload, secret, {
            expiresIn: 1008000,
          });
          response.status(200).end(`JWT ${token}`);
          console.log('Login successful', payload);
        } else {
          console.log('Incorrect login');
          response.status(404).send('Incorrect login');
        }
      });
    } else {
      response.writeHead(400, {
        'Content-Type': 'text/plain',
      });
      console.log('Restaurant not found');
      response.end('Restaurant not found');
    }
  });
});

// Update profile
router.put('/:rid', (request, response) => {
  console.log('\nEndpoint PUT: Restaurant fields update');
  const data = {
    remail: request.body.remail,
    rname: request.body.rname,
    rphone: request.body.rphone,
    rabout: request.body.rabout,
    rphoto: [...request.body.rphoto],
    rlatitude: request.body.rlatitude,
    rlongitude: request.body.rlatitude,
    raddress: request.body.raddress,
    rcuisine: request.body.rcuisine,
    rdelivery: request.body.rdelivery,
    rdish: [...request.body.rdish],
    rhours: request.body.hours,
    rrating: request.body.rrating,
    revents: [...request.body.revents],
  };
  Restaurants.findByIdAndUpdate(request.params.rid, data, (error, restaurant) => {
    if (error) {
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      console.log('Error in finding restaurant with ID');
      response.end('Error in finding restaurant with ID');
    } else if (restaurant) {
      console.log('Sending 200');
      response.writeHead(200, {
        'Content-Type': 'text/plain',
      });
      response.end('restaurant updated');
    } else {
      response.writeHead(400, {
        'Content-Type': 'text/plain',
      });
      console.log('restaurant not found');
      response.end('restaurant not found');
    }
  });
});

// Update password
router.put('/:rid/password', (request, response) => {
  console.log('\nEndpoint PUT: Restaurant fields update');
  const data = {
    rpassword: request.body.rpassword,
  };
  Restaurants.findByIdAndUpdate(request.params.rid, data, (error, restaurant) => {
    if (error) {
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      console.log('Error in finding restaurant with ID');
      response.end('Error in finding restaurant with ID');
    } else if (restaurant) {
      console.log('Sending 200');
      response.writeHead(200, {
        'Content-Type': 'text/plain',
      });
      response.end('restaurant updated');
    } else {
      response.writeHead(400, {
        'Content-Type': 'text/plain',
      });
      console.log('restaurant not found');
      response.end('restaurant not found');
    }
  });
});

module.exports = router;
