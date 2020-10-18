const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { mongoDB, secret } = require('../Utils/config');
const Customers = require('../Models/CustModel');

//const bcrypt = require('bcrypt');

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

// get all customers
router.get('/', (req, res) => {
  console.log('Hit customers');
  res.send('Get all customers');
});

// signup
router.post('/', (request, response) => {
  console.log('\nEndpoint POST: customer signup');
  console.log('Req Body: ', request.body);

  const newCustomer = new Customers({
    cemail: request.body.cemail,
    cpassword: request.body.cpassword,
    cname: request.body.cname,
  });

  Customers.findOne({ cemail: request.body.cemail }, (error, customer) => {
    if (error) {
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      console.log('Error in finding customer');
      response.end('Error in finding customer');
    } else if (customer) {
      response.writeHead(400, {
        'Content-Type': 'text/plain',
      });
      console.log('Email ID already registered');
      response.end('Email ID already registered');
    } else {
      newCustomer.save((err, data) => {
        if (err) {
          response.writeHead(500, {
            'Content-Type': 'text/plain',
          });
          console.log('Error in saving new customer');
          response.end('Error in saving new customer');
        } else {
          response.writeHead(200, {
            'Content-Type': 'text/plain',
          });
          console.log('Successfully added customer to database');
          response.end('Successfully added customer to database');
        }
      });
    }
  });
});

// Get customer object using email ID--OR Login
router.post('/login', (request, response) => {
  console.log('\nEndpoint GET: customer using email id');
  console.log('Req Body: ', request.body);
  Customers.findOne({ cemail: request.body.cemail }, (error, customer) => {
    if (error) {
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      console.log('Error in finding customer with email ID');
      response.end('Error in finding customer with email ID');
    } else if (customer) {
      const payload = {
        cid: customer._id,
        cemail: customer.username,
        cpassword: customer.password,
        cname: customer.cname,
        cphone: customer.cphone,
        cabout: customer.cabout,
        cjoined: customer.cjoined,
        cphoto: customer.cphoto,
        cfavrest: customer.cfavrest,
        cfavcuisine: customer.favcuisine,
      };
      const token = jwt.sign(payload, secret, {
        expiresIn: 1008000,
      });

      response.status(200).end('JWT ' + token);
      console.log('Login successful', customer);
    } else {
      response.writeHead(400, {
        'Content-Type': 'text/plain',
      });
      console.log('Customer not found');
      response.end('Customer not found');
    }
  });
});

module.exports = router;
