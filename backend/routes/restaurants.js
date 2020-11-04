const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { mongoDB, secret } = require('../Utils/config');
const { checkAuth, auth } = require('../Utils/passport');
const Restaurants = require('../Models/RestModel');
const Reviews = require('../Models/ReviewModel');
const Dishes = require('../Models/DishModel');
const kafka = require('../kafka/client');

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

// get all restaurants kafka done
router.get('/', (request, response) => {
  console.log('\nEndpoint GET: all restaurants');
  console.log('Req Body: ', request.body);
  kafka.make_request('restaurantsTopic', 'GETALL', request.body, (err, result) => {
    console.log('Get all result ', result);
    if (err) {
      console.log('Restaurants getall Kafka error');
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      response.end('Restaurants getall Kafka error');
    } else {
      response.writeHead(result.status, {
        'Content-Type': result.header,
      });
      console.log(result.content);
      response.end(result.content);
    }
  });
});

// Get one restaurant
router.get('/:rid', (request, response) => {
  console.log('\nEndpoint GET: Get a restaurant');
  console.log('Req Body: ', request.body);
  const data = { ...request.params };

  kafka.make_request('restaurantsTopic', 'GETONE', data, (err, result) => {
    console.log('Get one restaurant result ', result);
    if (err) {
      console.log('Restaurants getone Kafka error');
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      response.end('Restaurants getone Kafka error');
    } else {
      response.writeHead(result.status, {
        'Content-Type': result.header,
      });
      console.log(result.content);
      response.end(result.content);
    }
  });
});

// Sign up
router.post('/', (request, response) => {
  console.log('\nEndpoint POST: restaurant signup');
  console.log('Req Body: ', request.body);
  kafka.make_request('restaurantsTopic', 'SIGNUP', request.body, (err, result) => {
    console.log('Signup result ', result);
    if (err) {
      console.log('Restaurants signup Kafka error');
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      response.end('Restaurants signup Kafka error');
    } else if (result.status === 200) {
      const token = jwt.sign(result.payload, secret, {
        expiresIn: 1008000,
      });
      console.log('Login successful token:', token);
      response.status(result.status).end(`JWT ${token}`);
      console.log(result.content);
    } else {
      response.writeHead(result.status, {
        'Content-Type': result.header,
      });
      console.log(result.content);
      response.end(result.content);
    }
  });
});

// Login
router.post('/login', (request, response) => {
  console.log('\nEndpoint POST: Restaurant login');
  console.log('Req Body: ', request.body);
  kafka.make_request('restaurantsTopic', 'LOGIN', request.body, (err, result) => {
    console.log('Login result ', result);
    if (err) {
      console.log('Restaurants login Kafka error');
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      response.end('Restaurants login Kafka error');
    } else if (result.status === 200) {
      console.log('-==> payload received: ', result.payload);
      const token = jwt.sign(result.payload, secret, {
        expiresIn: 1008000,
      });
      console.log('Login successful token:', token);
      response.status(result.status).end(`JWT ${token}`);
      console.log(result.content);
    } else {
      response.writeHead(result.status, {
        'Content-Type': result.header,
      });
      console.log(result.content);
      response.end(result.content);
    }
  });
});

// Update profile
router.put('/:rid', checkAuth, (request, response) => {
  console.log('\nEndpoint PUT: Restaurant fields update');
  console.log('Req Body: ', request.body);
  const data = { ...request.params, ...request.body };

  kafka.make_request('restaurantsTopic', 'UPDATE', data, (err, result) => {
    console.log('Update restaurant profile result ', result);
    if (err) {
      console.log('Restaurants update profile Kafka error');
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      response.end('Restaurants update profile Kafka error');
    } else {
      response.writeHead(result.status, {
        'Content-Type': result.header,
      });
      console.log(result.content);
      response.end(result.content);
    }
  });
});

// Update password
router.put('/:rid/password', (request, response) => {
  console.log('\nEndpoint PUT: Restaurant password update');
  console.log('Req Body: ', request.body);
  const data = { ...request.params, ...request.body };
  console.log('==> ', data);

  kafka.make_request('restaurantsTopic', 'UPDATEPASS', data, (err, result) => {
    console.log('Update restaurant password result ', result);
    if (err) {
      console.log('Restaurant update password Kafka error');
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      response.end('Restaurant update password Kafka error');
    } else {
      response.writeHead(result.status, {
        'Content-Type': result.header,
      });
      console.log(result.content);
      response.end(result.content);
    }
  });
});

// Reviews--add review
router.post('/:rid/reviews', (request, response) => {
  console.log('\nEndpoint POST: Restaurant add review');
  console.log('Req Body: ', request.body);
  const data = { ...request.params, ...request.body };
  console.log('==> ', data);

  kafka.make_request('restaurantsTopic', 'ADDREVIEW', data, (err, result) => {
    console.log('Add review result ', result);
    if (err) {
      console.log('Restaurant add review Kafka error');
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      response.end('Restaurant add review Kafka error');
    } else {
      response.writeHead(result.status, {
        'Content-Type': result.header,
      });
      console.log(result.content);
      response.end(result.content);
    }
  });
});

// View reviews for restaurant
router.get('/:rid/reviews', (request, response) => {
  console.log('\nEndpoint GET: restaurant reviews get');
  console.log('Req Body: ', request.body);
  const data = { ...request.params };

  kafka.make_request('restaurantsTopic', 'GETREVIEWS', data, (err, result) => {
    console.log('Get reviews result ', result);
    if (err) {
      console.log('Get reviews Kafka error');
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      response.end('Get reviews Kafka error');
    } else {
      response.writeHead(result.status, {
        'Content-Type': result.header,
      });
      console.log(result.content);
      response.end(result.content);
    }
  });
});

// Get average rating for restaurant
router.get('/:rid/average', (request, response) => {
  console.log('\nEndpoint GET: restaurant reviews get');
  console.log('Req Body: ', request.body);
  const data = { ...request.params };

  kafka.make_request('restaurantsTopic', 'GETRATING', data, (err, result) => {
    console.log('Get reviews result ', result);
    if (err) {
      console.log('Get reviews Kafka error');
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      response.end('Get reviews Kafka error');
    } else {
      response.writeHead(result.status, {
        'Content-Type': result.header,
      });
      console.log(result.content);
      response.end(result.content);
    }
  });
});

/* ************ Search queries ***************** */

// Get restaurant ID serving a dish by dishname
router.post('/search/dish', (request, response) => {
  console.log('\nEndpoint POST: Search restaurant by dish');
  console.log('Req Body: ', request.body);
  const data = { ...request.body };

  kafka.make_request('restaurantsTopic', 'SEARCHBYDISH', data, (err, result) => {
    console.log('Search by dish result ', result);
    if (err) {
      console.log('Get reviews Kafka error');
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      response.end('Get reviews Kafka error');
    } else {
      response.writeHead(result.status, {
        'Content-Type': result.header,
      });
      console.log(result.content);
      response.end(result.content);
    }
  });
});

// Get restuarants serving a cuisine
// changed get to post--axios did not like get requests with a body
router.post('/search/cuisine', (request, response) => {
  console.log('\nEndpoint POST: Search restaurants by cuisine');
  console.log('Req Body: ', request.body);
  const data = { ...request.body };

  kafka.make_request('restaurantsTopic', 'SEARCHBYCUISINE', data, (err, result) => {
    console.log('Search by cuisine result ', result);
    if (err) {
      console.log('Get reviews Kafka error');
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      response.end('Get reviews Kafka error');
    } else {
      response.writeHead(result.status, {
        'Content-Type': result.header,
      });
      console.log(result.content);
      response.end(result.content);
    }
  });
});

// Get restuarants serving by delivery
router.post('/search/rdelivery', (request, response) => {
  console.log('\nEndpoint POST: Search restaurants by delivery');
  console.log('Req Body: ', request.body);
  const data = { ...request.body };

  kafka.make_request('restaurantsTopic', 'SEARCHBYDELIVERY', data, (err, result) => {
    console.log('Search by delivery result ', result);
    if (err) {
      console.log('Get reviews Kafka error');
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      response.end('Get reviews Kafka error');
    } else {
      response.writeHead(result.status, {
        'Content-Type': result.header,
      });
      console.log(result.content);
      response.end(result.content);
    }
  });
});

module.exports = router;
