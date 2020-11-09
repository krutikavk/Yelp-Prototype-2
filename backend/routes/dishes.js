const express = require('express');
const { checkAuth, auth } = require('../Utils/passport');
const kafka = require('../kafka/client');

auth();

const router = express.Router();

// Add a dish
router.post('/', checkAuth, (request, response) => {
  console.log('\nEndpoint POST: Add a dish');
  console.log('Req Body: ', request.body);
  const data = { ...request.body };

  kafka.make_request('dishesTopic', 'ADDDISH', data, (err, result) => {
    console.log('Add dish result ', result);
    if (err) {
      console.log('Add dish Kafka error');
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      response.end('Add dish Kafka error');
    } else {
      response.writeHead(result.status, {
        'Content-Type': result.header,
      });
      console.log(result.content);
      response.end(result.content);
    }
  });
  /*
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
  */
});

// Get all dishes for a restaurant
router.get('/:rid', checkAuth, (request, response) => {
  console.log('\nEndpoint GET: Get all dishes for a restaurant');
  console.log('Req Body: ', request.body);
  const data = { ...request.params};

  kafka.make_request('dishesTopic', 'GETALLFORREST', data, (err, result) => {
    console.log('Add dish result ', result);
    if (err) {
      console.log('Add dish Kafka error');
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      response.end('Add dish Kafka error');
    } else {
      response.writeHead(result.status, {
        'Content-Type': result.header,
      });
      console.log(result.content);
      response.end(result.content);
    }
  });
  /*
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
  */
});

// Edit a dish
router.put('/:did', checkAuth, (request, response) => {
  console.log('\nEndpoint PUT: Edit a dish');
  console.log('Req Body: ', request.body);
  const data = { ...request.params, ...request.body };

  kafka.make_request('dishesTopic', 'EDITDISH', data, (err, result) => {
    console.log('Edit dish result ', result);
    if (err) {
      console.log('Edit dish Kafka error');
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      response.end('Edit dish Kafka error');
    } else {
      response.writeHead(result.status, {
        'Content-Type': result.header,
      });
      console.log(result.content);
      response.end(result.content);
    }
  });
  /*
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
  */
});

module.exports = router;
