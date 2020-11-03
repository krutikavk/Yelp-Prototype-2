const express = require('express');
const jwt = require('jsonwebtoken');
const { mongoDB, secret } = require('../Utils/config');
const { checkAuth, auth } = require('../Utils/passport');
const kafka = require('../kafka/client');

auth();

const router = express.Router();

// get all customers kafka done
router.get('/', checkAuth, (request, response) => {
  console.log('\nEndpoint GET: all customers');
  console.log('Req Body: ', request.body);
  kafka.make_request('customersTopic', 'GETALL', request.body, (err, result) => {
    console.log('Get all result ', result);
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

// signup kafka done
router.post('/', (request, response) => {
  console.log('\nEndpoint POST: customer signup');
  console.log('Req Body: ', request.body);
  kafka.make_request('customersTopic', 'SIGNUP', request.body, (err, result) => {
    console.log('Signup result ', result);
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

// Login kafka done
router.post('/login', (request, response) => {
  console.log('\nEndpoint POST: customer login');
  console.log('Req Body: ', request.body);

  kafka.make_request('customersTopic', 'LOGIN', request.body, (err, result) => {
    console.log('Login result ', result);
    if (err) {
      console.log('Customers login Kafka error');
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      response.end('Customers login Kafka error');
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

// Get one customer kafka done
router.get('/:cid', checkAuth, (request, response) => {
  console.log('\nEndpoint GET: one customer');
  console.log('Req Body: ', request.body);
  const data = { ...request.params };

  kafka.make_request('customersTopic', 'GETONE', data, (err, result) => {
    console.log('Get one customer result ', result);
    if (err) {
      console.log('Customers getone Kafka error');
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      response.end('Customers getone Kafka error');
    } else {
      response.writeHead(result.status, {
        'Content-Type': result.header,
      });
      console.log(result.content);
      response.end(result.content);
    }
  });
});

// Update customer profile--works kafka done
router.put('/:cid', checkAuth, (request, response) => {
  console.log('\nEndpoint PUT: Customer fields update');
  console.log('Req Body: ', request.body);
  const data = { ...request.params, ...request.body };

  kafka.make_request('customersTopic', 'UPDATE', data, (err, result) => {
    console.log('Update customer profile result ', result);
    if (err) {
      console.log('Customers update profile Kafka error');
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      response.end('Customers update profile Kafka error');
    } else {
      response.writeHead(result.status, {
        'Content-Type': result.header,
      });
      console.log(result.content);
      response.end(result.content);
    }
  });
});

// Update customer password
router.put('/:cid/password', checkAuth, (request, response) => {
  console.log('\nEndpoint PUT: customer password update');
  console.log('Req Body: ', request.body);
  const data = { ...request.params, ...request.body };
  console.log('==> ', data);

  kafka.make_request('customersTopic', 'UPDATEPASS', data, (err, result) => {
    console.log('Update customer password result ', result);
    if (err) {
      console.log('Customers update password Kafka error');
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      response.end('Customers update password Kafka error');
    } else {
      response.writeHead(result.status, {
        'Content-Type': result.header,
      });
      console.log(result.content);
      response.end(result.content);
    }
  });
});

// Follow another customer
// request.params.cid follows customer in request.body
router.post('/:cid/follow', checkAuth, (request, response) => {
  console.log('\nEndpoint POST: customer follow');
  console.log('Req Body: ', request.body);
  const data = {
    cid1: request.params.cid,
    cid2: request.body.cid,
  };
  console.log('==>data ', data);

  kafka.make_request('customersTopic', 'FOLLOW', data, (err, result) => {
    console.log('Follow customer password result ', result);
    if (err) {
      console.log('Customers follow Kafka error');
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      response.end('Customers follow Kafka error');
    } else {
      response.writeHead(result.status, {
        'Content-Type': result.header,
      });
      console.log(result.content);
      response.end(result.content);
    }
  });
});

// View reviews added by a customer
router.get('/:cid/reviews', checkAuth, (request, response) => {
  console.log('\nEndpoint GET: Customer reviews get');
  console.log('Req Body: ', request.body);
  const data = { ...request.params };
  console.log('==>data ', data);

  kafka.make_request('customersTopic', 'GETREVIEWS', data, (err, result) => {
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

module.exports = router;
