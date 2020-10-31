const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { mongoDB, secret } = require('../Utils/config');
const { checkAuth, auth } = require('../Utils/passport');
const Dishes = require('../Models/DishModel');
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

// Add a dish
router.post('/', (request, response) => {
  const newDish = new Dishes({
    rid: request.body.rid,
    dname: request.body.dname,
    dingredients: request.body.dingredients,
    dprice: request.body.dprice,
    dcategory: request.body.dcategory,
    durl: request.body.durl,
  });

  // id of new dish is newDish._id
  console.log('ID of new dish: ', newDish._id);
  console.log('Endpoint POST: Add dishes');
  console.log('Request Body: ', request.body);

  newDish.save((err) => {
    if (err) {
      response.writeHead(400, {
        'Content-Type': 'text/plain',
      });
      console.log('Error in saving new dish');
      response.end('Error in saving new dosh');
    } else {
      // Save ID of dish to restaurant model
      response.writeHead(200, {
        'Content-Type': 'text/plain',
      });
      response.status(200).end('Added new dish');
    }
  });
});

// Get all dishes for a restaurant
router.get('/:rid', (request, response) => {
  Dishes.find({ rid: request.params.rid }, (error, dishes) => {
    if (error) {
      response.writeHead(400, {
        'Content-Type': 'text/plain',
      });
      console.log('Error in saving new event');
      response.end('Error in saving new event');
    } else if (dishes) {
      response.writeHead(200, {
        'Content-Type': 'application/json',
      });
      response.end(JSON.stringify(dishes));
    } else {
      response.writeHead(400, {
        'Content-Type': 'text/plain',
      });
      console.log('Error in saving new event');
      response.end('Error in saving new event');
    }
  });
});

// Edit a dish
router.put('/:did', (request, response) => {
  const data = {
    dname: request.body.dname,
    dingredients: request.body.dingredients,
    dprice: request.body.dprice,
    ddescription: request.body.ddescription,
    dcategory: request.body.dcategory,
  };
  Dishes.findByIdAndUpdate(request.params.did, data, (error) => {
    if (error) {
      response.writeHead(400, {
        'Content-Type': 'text/plain',
      });
      console.log('Error in updating new dish');
      response.end('Error in updating new dish');
    } else {
      response.writeHead(200, {
        'Content-Type': 'text/plain',
      });
      console.log('Updated dish');
      response.end('Updated dish');
    }
  });
});

module.exports = router;
