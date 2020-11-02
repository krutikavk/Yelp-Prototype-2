const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { mongoDB, secret } = require('../Utils/config');
const { checkAuth, auth } = require('../Utils/passport');
const Customers = require('../Models/CustModel');
const Reviews = require('../Models/ReviewModel');
var kafka = require('../kafka/client');

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

// get all customers
router.get('/', (request, response) => {
  /*
  console.log('Hit get all customers');
  Customers.find({}, (error, results) => {
    if (error) {
      response.writeHead(400, {
        'Content-Type': 'text/plain',
      });
      response.end('Error fetching customers');
    } else {
      console.log('Sending 200');
      response.writeHead(200, {
        'Content-Type': 'application/json',
      });
      response.end(JSON.stringify(results));
    }
  });
  */
  console.log('\nEndpoint GET: all customers');
  console.log('Req Body: ', request.body);
  kafka.make_request('customersTopic', 'GETALL', request.body, (err, result) => {
    console.log('get all result ', result);
    if (err) {
      console.log('Customers getall Kafka error');
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      response.end('Customers getall Kafka error');
    } else {
      response.writeHead(result.status, {
        'Content-Type': result.header,
      });
      console.log(result.content);
      response.end(result.content);
    }
  });
});

// signup
router.post('/', (request, response) => {
  console.log('\nEndpoint POST: customer signup');
  console.log('Req Body: ', request.body);
  kafka.make_request('customersTopic', 'SIGNUP', request.body, (err, result) => {
    console.log('get all result ', result);
    if (err) {
      console.log('Customers signup Kafka error');
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      response.end('Customers signup Kafka error');
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
  console.log('\nEndpoint POST: customer login');
  console.log('Req Body: ', request.body);
  Customers.findOne({ cemail: request.body.cemail }, (error, customer) => {
    if (error) {
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      console.log('Error in finding customer with email ID');
      response.end('Error in finding customer with email ID');
    } else if (customer) {
      bcrypt.compare(request.body.cpassword, customer.cpassword, (err, result) => {
        console.log('in db: ', customer.cpassword);
        if (result === true) {
          const payload = {
          // eslint-disable-next-line no-underscore-dangle
            cid: customer._id,
            cemail: customer.cemail,
            cpassword: customer.cpassword,
            cname: customer.cname,
            cphone: customer.cphone,
            cabout: customer.cabout,
            cjoined: customer.cjoined,
            cphoto: customer.cphoto,
            cfavrest: customer.cfavrest,
            cfavcuisine: customer.favcuisine,
            // cevents: [...customer.cevents],
            cfollowers: [...customer.cfollowers],
          };
          const token = jwt.sign(payload, secret, {
            expiresIn: 1008000,
          });
          response.status(200).end(`JWT ${token}`);
          console.log('Login successful', customer);
        } else {
          response.status(404).send('Incorrect login');
        }
      });
    } else {
      response.writeHead(400, {
        'Content-Type': 'text/plain',
      });
      console.log('Customer not found');
      response.end('Customer not found');
    }
  });
});

// Get one customer
router.get('/:cid', (request, response) => {
  console.log('\nEndpoint GET: Get a customer');
  Customers.findById(request.params.cid, (error, customer) => {
    if (error) {
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      console.log('Error in finding customer with ID');
      response.end('Error in finding customer with ID');
    } else if (customer) {
      console.log('Sending 200');
      response.writeHead(200, {
        'Content-Type': 'application/json',
      });
      response.end(JSON.stringify(customer));
    } else {
      response.writeHead(400, {
        'Content-Type': 'text/plain',
      });
      console.log('Customer not found');
      response.end('Customer not found');
    }
  });
});

// Update customer profile--works
router.put('/:cid', (request, response) => {
  console.log('\nEndpoint PUT: Customer fields update');
  const data = {
    cemail: request.body.cemail,
    cname: request.body.cname,
    cphone: request.body.cphone,
    cabout: request.body.cabout,
    cphoto: request.body.cphoto,
    cfavrest: request.body.cfavrest,
    cfavcuisine: request.body.cfavcuisine,
  };
  Customers.findByIdAndUpdate(request.params.cid, data, (error, customer) => {
    if (error) {
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      console.log('Error in finding customer with ID');
      response.end('Error in finding customer with ID');
    } else if (customer) {
      console.log('Sending 200');
      response.writeHead(200, {
        'Content-Type': 'text/plain',
      });
      response.end('Customer updated');
    } else {
      response.writeHead(400, {
        'Content-Type': 'text/plain',
      });
      console.log('Customer not found');
      response.end('Customer not found');
    }
  });
});

// Update customer password
router.put('/:cid/password', (request, response) => {
  console.log('\nEndpoint PUT: customer password update');
  bcrypt.hash(request.body.cpassword, 10, (e, hash) => {
    const data = {
      cpassword: hash,
    };
    Customers.findByIdAndUpdate(request.params.cid, data, (error, customer) => {
      if (error) {
        response.writeHead(500, {
          'Content-Type': 'text/plain',
        });
        console.log('Error in finding customer with ID');
        response.end('Error in finding customer with ID');
      } else if (customer) {
        console.log('Sending 200');
        response.writeHead(200, {
          'Content-Type': 'text/plain',
        });
        response.end('Customer password updated');
      } else {
        response.writeHead(400, {
          'Content-Type': 'text/plain',
        });
        console.log('Customer not found');
        response.end('Customer not found');
      }
    });
  });
});

/*
function addFollower(cid1, cid2) {
  Customers.findById(cid1, (error, customer1) => {
    if (error) return false;
    console.log('Customer followers:', customer1.cfollowers);
    customer1.cfollowers.push(cid2);
    customer1.save (err => {
      if (err) return false;
      return true;
    });
  });
}

//customer2 is following customer1
//Add customer1 to customer2's following
function addFollowing(cid1, cid2) {
   Customers.findById(cid2, (error, customer2) => {
    if(error) return false;
    console.log('Customer following:', customer2.cfollowing)
    customer2.cfollowing.push(cid1);
    customer2.save(err => {
      if(err) return false;
      return true;
    })
  })
}
*/

// Follow another customer
// request.params.cid follows customer in request.body
router.post('/:cid/follow', (request, response) => {
  console.log('\nEndpoint POST: customer follow');
  Customers.findById(request.params.cid, (error, customer1) => {
    if (error) {
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      console.log('Error in finding customer with ID');
      response.end('Error in finding customer with ID');
    } else if (customer1) {
      Customers.findById(request.body.cid, (err, customer2) => {
        if (error) {
          response.writeHead(500, {
            'Content-Type': 'text/plain',
          });
          console.log('Error in finding customer with ID');
          response.end('Error in finding customer with ID');
        }
        // console.log('Customer following:', customer2.cfollowing);
        customer2.cfollowers.push(request.params.cid);
        customer2.save((er) => {
          if (er) {
            // Customer 2 found
            response.writeHead(500, {
              'Content-Type': 'text/plain',
            });
            console.log('Error in finding customer with ID');
            response.end('Error in finding customer with ID');
          } else {
            customer1.cfollowing.push(request.body.cid);
            customer1.save((e) => {
              if (e) {
                response.writeHead(500, {
                  'Content-Type': 'text/plain',
                });
                console.log('Error in finding customer with ID');
                response.end('Error in finding customer with ID');
              } else {
                response.writeHead(200, {
                  'Content-Type': 'text/plain',
                });
                console.log('Operation completed');
                response.end('Operation completed');
              }
            });
          }
        });
      });
    } else {
      response.writeHead(400, {
        'Content-Type': 'text/plain',
      });
      console.log('Customer not found');
      response.end('Customer not found');
    }
  });
});

// View reviews added by a customer
router.get('/:cid/reviews', checkAuth, (request, response) => {
  console.log('\nEndpoint GET: Customer reviews get');
  console.log('Req Body: ', request.body);
  Reviews.find({ cid: request.params.cid }, (error, reviews) => {
    if (error) {
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      console.log('Error in finding reviews');
      response.end('Error in finding reviews');
    } else if (reviews) {
      console.log('Sending 200');
      response.writeHead(200, {
        'Content-Type': 'application/json',
      });
      response.end(JSON.stringify(reviews));
    } else {
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      console.log('Error in finding reviews');
      response.end('Error in finding reviews');
    }
  });
});

module.exports = router;
