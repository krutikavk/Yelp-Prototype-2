const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { mongoDB, secret } = require('../Utils/config');
const { checkAuth, auth } = require('../Utils/passport');
const Customers = require('../Models/CustModel');

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
});

// signup
router.post('/', (request, response) => {
  const now = new Date();
  const jsonDate = now.toJSON();
  const joined = new Date(jsonDate);
  console.log('\nEndpoint POST: customer signup');
  console.log('Req Body: ', request.body);
  console.log(joined);

  bcrypt.hash(request.body.cpassword, 10, (errHash, hash) => {
    const newCustomer = new Customers({
      cemail: request.body.cemail,
      cpassword: hash,
      cname: request.body.cname,
      cjoined: joined,
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
        console.log('customer: ', customer);
        console.log('Email ID already registered');
        response.end('Email ID already registered');
      } else {
        newCustomer.save((err) => {
          if (err) {
            response.writeHead(500, {
              'Content-Type': 'text/plain',
            });
            console.log('Error in saving new customer');
            response.end('Error in saving new customer');
          } else {
            console.log('Successfully added customer to database');
            // return the customer object back
            Customers.findOne({ cemail: request.body.cemail }, (e, cust) => {
              if (e) {
                response.writeHead(500, {
                  'Content-Type': 'text/plain',
                });
                console.log('Error in finding customer with email ID');
                response.end('Error in finding customer with email ID');
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
                const token = jwt.sign(payload, secret, {
                  expiresIn: 1008000,
                });
                console.log('Login successful token:', token);
                response.status(200).end(`JWT ${token}`);
              } else {
                response.writeHead(500, {
                  'Content-Type': 'text/plain',
                });
                console.log('Customer not found');
                response.end('Customer not found');
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

/*
router.post('/:cid/orders', (request, response) => {
  console.log('Endpoint POST: Place an new order');
  console.log('Request Body: ', request.body);

  const now = new Date();
  const jsonDate = now.toJSON();
  const then = new Date(jsonDate);
  console.log(then);
});

*/

module.exports = router;
