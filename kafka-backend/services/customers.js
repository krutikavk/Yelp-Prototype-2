/*
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { mongoDB, secret } = require('../Utils/config');
const { checkAuth, auth } = require('../Utils/passport');
const Customers = require('../Models/CustModel');
const Reviews = require('../Models/ReviewModel');
*/
const mongoose = require('mongoose');
const { mongoDB, secret } = require('../Utils/config');
const Customers = require('../Models/CustModel');

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

function getAllCustomers(callback) {
  Customers.find({}, (error, results) => {
    if (error) {
      const response = {
        'status': 400,
        'header': 'text/plain',
        'content': 'Error fetching customers',
      }
      callback(null, response);
    } else {
      console.log('Sending 200');

      const response = {
        'status': 200,
        'header': 'application/json',
        'content': JSON.stringify(results),
      }
      callback(null, response);
    }
  });
}


function handle_request(msg, callback){
   
    console.log('Inside get all customers');
    console.log('Message:', msg);

    switch(msg.subTopic) {
      case 'GETALL': {
        getAllCustomers(callback);
        break;
      }
      

      default: {
        const response = {
          'status': 400,
          'header': 'text/plain',
          'content': 'Bad request',
        }
        callback(null, response);
      }

    }

};

exports.handle_request = handle_request;


