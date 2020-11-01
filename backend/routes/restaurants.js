const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { mongoDB, secret } = require('../Utils/config');
const { checkAuth, auth } = require('../Utils/passport');
const Restaurants = require('../Models/RestModel');
const Reviews = require('../Models/ReviewModel');
const Dishes = require('../Models/DishModel');

auth();

const router = express.Router();

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  poolSize: 500,
  bufferMaxEntries: 0,
  useFindAndModify: false,
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
router.get('/:rid', checkAuth, (request, response) => {
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
                  rid: rest._id,
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
                  rhours: { ...rest.rhours },
                  rrating: rest.rrating,
                  revents: [...rest.revents],
                };
                const token = jwt.sign(payload, secret, {
                  expiresIn: 1008000,
                });
                console.log('hours: ', rest.rhours);
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
            rhours: restaurant.rhours,
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
router.put('/:rid', checkAuth, (request, response) => {
  console.log('\nEndpoint PUT: Restaurant fields update');
  console.log('\nEndpoint PUT: Restaurant fields update', request.params.rid, 'xxxxx');
  const data = {
    remail: request.body.remail,
    rname: request.body.rname,
    rphone: request.body.rphone,
    rabout: request.body.rabout,
    rphoto: request.body.rphoto,
    rlatitude: request.body.rlatitude,
    rlongitude: request.body.rlongitude,
    raddress: request.body.raddress,
    rcuisine: request.body.rcuisine,
    rdelivery: request.body.rdelivery,
    rdish: request.body.rdish,
    rhours: request.body.rhours,
    rrating: request.body.rrating,
    revents: request.body.revents,
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

// Reviews--add review
router.post('/:rid/reviews', (request, response) => {
  const now = new Date();
  const jsonDate = now.toJSON();
  const current = new Date(jsonDate);

  const newReview = new Reviews({
    retext: request.body.retext,
    rerating: request.body.rerating,
    rdate: current,
    cid: request.body.cid,
    rid: request.params.rid,
  });

  console.log('\nEndpoint POST: restaurant review add');
  console.log('Req Body: ', request.body);
  newReview.save((error) => {
    if (error) {
      response.writeHead(400, {
        'Content-Type': 'text/plain',
      });
      console.log('Error saving review');
      response.end('Error saving review');
    } else {
      console.log('Review added');
      response.writeHead(200, {
        'Content-Type': 'text/plain',
      });
      response.end('Review added');
    }
  });
});

// View reviews for restaurant
router.get('/:rid/reviews', (request, response) => {
  console.log('\nEndpoint GET: restaurant reviews get');
  console.log('Req Body: ', request.body);
  Reviews.find({ rid: request.params.rid }, (error, reviews) => {
    if (error) {
      response.writeHead(400, {
        'Content-Type': 'text/plain',
      });
      console.log('Error saving review');
      response.end('Error saving review');
    } else {
      console.log('Review added');
      response.writeHead(200, {
        'Content-Type': 'application/json',
      });
      response.end(JSON.stringify(reviews));
    }
  });
});

// Get average rating for restaurant
router.get('/:rid/average', (request, response) => {
  console.log('\nEndpoint GET: restaurant reviews get');
  console.log('Req Body: ', request.body);
  Reviews.aggregate([
    {
      $group: {
        _id: '_id',
        'AVG(rerating)': {
          $avg: '$rerating',
        }
      } 
    }]).exec((error, result) => {
    if (error) {
      response.writeHead(400, {
        'Content-Type': 'text/plain',
      });
      console.log('Error getting average');
      response.end('Error getting average');
    } else {
      response.writeHead(200, {
        'Content-Type': 'application/json',
      });
      response.end(JSON.stringify(result));
    }
  });
});

/* ************ Search queries ***************** */

// Get restaurant ID serving a dish by dishname
router.post('/search/dish', (request, response) => {
  console.log('\nEndpoint POST: Get rid for restaurant serving a dish');
  console.log('Req Body: ', request.body);
  Dishes
    .find({ dname: request.body.dname })
    .select('rid')
    .distinct('rid', (error, results) => {
      if (error) {
        response.writeHead(400, {
          'Content-Type': 'text/plain',
        });
        console.log('Error getting rid');
        response.end('Error getting rid');
      } else {
        response.writeHead(200, {
          'Content-Type': 'application/json',
        });
        response.end(JSON.stringify(results));
      }
    });
});

// Get restuarants serving a cuisine
// changed get to post--axios did not like get requests with a body
router.post('/search/cuisine', (request, response) => {
  console.log('\nEndpoint POST: restaurants cuisine');
  console.log('Req Body: ', request.body);
  Restaurants.find({ rcuisine: request.body.rcuisine }, (error, restaurants) => {
    if (error) {
      response.writeHead(400, {
        'Content-Type': 'text/plain',
      });
      console.log('Error searching restaurants');
      response.end('Error searching restaurants');
    } else if (restaurants) {
      response.writeHead(200, {
        'Content-Type': 'application/json',
      });
      response.end(JSON.stringify(restaurants));
    } else {
      response.writeHead(400, {
        'Content-Type': 'text/plain',
      });
      console.log('No restaurants found');
      response.end('No restaurants found');
    }
  });
});

// Get restuarants serving by delivery
router.post('/search/rdelivery', (request, response) => {
  console.log('\nEndpoint POST: restaurants rdelivery');
  console.log('Req Body: ', request.body);
  Restaurants.find({ rdelivery: request.body.rdelivery }, (error, restaurants) => {
    if (error) {
      response.writeHead(400, {
        'Content-Type': 'text/plain',
      });
      console.log('Error searching restaurants');
      response.end('Error searching restaurants');
    } else if (restaurants) {
      response.writeHead(200, {
        'Content-Type': 'application/json',
      });
      response.end(JSON.stringify(restaurants));
    } else {
      response.writeHead(400, {
        'Content-Type': 'text/plain',
      });
      console.log('No restaurants found');
      response.end('No restaurants found');
    }
  });
});

module.exports = router;
