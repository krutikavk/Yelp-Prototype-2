/*
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { mongoDB, secret } = require('../Utils/config');
const { checkAuth, auth } = require('../Utils/passport');
const Customers = require('../Models/CustModel');
const Reviews = require('../Models/ReviewModel');
*/
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
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
        status: 400,
        header: 'text/plain',
        content: 'Error fetching customers',
      };
      callback(null, response);
    } else {
      console.log('Sending 200');

      const response = {
        status: 200,
        header: 'application/json',
        content: JSON.stringify(results),
      };
      callback(null, response);
    }
  });
}

function signUpCustomer(data, callback) {
  const now = new Date();
  const jsonDate = now.toJSON();
  const joined = new Date(jsonDate);

  bcrypt.hash(data.cpassword, 10, (errHash, hash) => {
    const newCustomer = new Customers({
      cemail: data.cemail,
      cpassword: hash,
      cname: data.cname,
      cjoined: joined,
    });
    Customers.findOne({ cemail: data.cemail }, (error, customer) => {
      if (error) {
        const response = {
          status: 400,
          header: 'text/plain',
          content: 'Error in finding customer',
        };
        console.log('Error in finding customer');
        callback(null, response);
      } else if (customer) {
        const response = {
          status: 400,
          header: 'text/plain',
          content: 'Email ID already registered',
        };
        console.log('Email ID already registered');
        callback(null, response);
      } else {
        newCustomer.save((err) => {
          if (err) {
            const response = {
              status: 400,
              header: 'text/plain',
              content: 'Error in saving new customer',
            };
            console.log('Error in saving new customer');
            callback(null, response);
          } else {
            console.log('Successfully added customer to database');
            // return the customer object back
            Customers.findOne({ cemail: data.cemail }, (e, cust) => {
              if (e) {
                const response = {
                  status: 400,
                  header: 'text/plain',
                  content: 'Error in finding customer with email ID',
                };
                console.log('Error in finding customer with email ID');
                callback(null, response);
              } else if (cust) {
                const payload = {
                  // eslint-disable-next-line no-underscore-dangle
                  cid: cust._id,
                  cemail: cust.username,
                  cpassword: cust.password,
                  cname: cust.cname,
                  cphone: cust.cphone,
                  cabout: cust.cabout,
                  cjoined: cust.cjoined,
                  cphoto: cust.cphoto,
                  cfavrest: cust.cfavrest,
                  cfavcuisine: cust.favcuisine,
                  // cevents: [...cust.cevents],
                  cfollowers: [...cust.cfollowers],
                };
                const response = {
                  status: 200,
                  header: 'text/plain',
                  content: 'Signup successful',
                  payload,
                };
                console.log('Signup successful');
                callback(null, response);
              } else {
                const response = {
                  status: 400,
                  header: 'text/plain',
                  content: 'Customer not found',
                };
                console.log('Customer not found');
                callback(null, response);
              }
            });
          }
        });
      }
    });
  });
}

function handle_request(msg, callback) {
  console.log('Inside get all customers');
  console.log('Message:', msg);

  switch (msg.subTopic) {
    case 'GETALL': {
      console.log('Inside get all customers');
      console.log('Message:', msg);
      getAllCustomers(callback);
      break;
    }

    case 'SIGNUP': {
      console.log('Inside signup customers');
      console.log('Message:', msg);
      signUpCustomer(msg.data, callback);
      break;
    }

    default: {
      const response = {
        status: 400,
        header: 'text/plain',
        content: 'Bad request',
      };
      callback(null, response);
    }
  }
}

exports.handle_request = handle_request;
