const express = require('express');
const { checkAuth, auth } = require('../Utils/passport');
const kafka = require('../kafka/client');

auth();

const router = express.Router();

// Place a new order
router.post('/', (request, response) => {
  console.log('Endpoint POST: Place a new order');
  console.log('Request Body: ', request.body);
  const data = { ...request.body };
  kafka.make_request('ordersTopic', 'PLACEORDER', data, (err, result) => {
    console.log('Place order result ', result);
    if (err) {
      console.log('Place new order Kafka error');
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      response.end('Restaurants signup Kafka error');
    } else {
      response.writeHead(result.status, {
        'Content-Type': result.header,
      });
      console.log(result.content);
      response.end(result.content);
    }
  });

  /*
  const now = new Date();
  const jsonDate = now.toJSON();
  const ordertime = new Date(jsonDate);

  console.log('Endpoint POST: Place a new order');
  console.log('Request Body: ', request.body);
  console.log(ordertime);

  const newOrder = new Orders({
    cid: request.body.cid,
    rid: request.body.rid,
    ooption: request.body.ooption,
    ostatus: request.body.ostatus,
    otype: request.body.otype,
    otime: ordertime,
    oaddress: request.body.oaddress,
    odishes: [...request.body.odishes],
  });
  newOrder.save((error) => {
    if (error) {
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      console.log('Error in saving new customer');
      response.end('Error in saving new customer');
    } else {
      console.log('Successfully placed order');
      Orders
        .find({ cid: request.body.cid, rid: request.body.rid })
        .select({})
        .sort({ otime: -1 })
        .limit(1)
        .exec((err, order) => {
          if (err) {
            response.writeHead(500, {
              'Content-Type': 'text/plain',
            });
            console.log('Error in finding order');
            response.end('Error in finding order');
          } else if (order) {
            response.writeHead(200, {
              'Content-Type': 'application/json',
            });
            response.end(JSON.stringify(order));
          } else {
            response.writeHead(500, {
              'Content-Type': 'text/plain',
            });
            console.log('Error in finding order');
            response.end('Error in finding order');
          }
        });
    }
  });
  */
});

// Get all orders for a restaurant
router.get('/restaurants/:rid', (request, response) => {
  console.log('Endpoint GET: Get all orders for rest');
  console.log('Request Body: ', request.body);
  const data = { ...request.params, ...request.body };
  kafka.make_request('ordersTopic', 'ORDERSFORREST', data, (err, result) => {
    console.log('Place order result ', result);
    if (err) {
      console.log('Place new order Kafka error');
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      response.end('Restaurants signup Kafka error');
    } else {
      response.writeHead(result.status, {
        'Content-Type': result.header,
      });
      console.log(result.content);
      response.end(result.content);
    }
  });
  /*
  Orders.find({ rid: request.params.rid }, (error, results) => {
    if (error) {
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      console.log('Error fetching orders');
      response.end('Error fetching orders');
    } else if (results) {
      response.writeHead(200, {
        'Content-Type': 'application/json',
      });
      response.end(JSON.stringify(results));
    } else {
      response.writeHead(400, {
        'Content-Type': 'text/plain',
      });
      response.end('Could not find orders');
    }
  });
  */
});

// Get all orders for a customer
router.get('/customers/:cid', (request, response) => {
  console.log('Endpoint GET: Get all orders for cust');
  console.log('Request Body: ', request.body);
  const data = { ...request.params, ...request.body };
  kafka.make_request('ordersTopic', 'ORDERSFORCUST', data, (err, result) => {
    console.log('Place order result ', result);
    if (err) {
      console.log('Place new order Kafka error');
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      response.end('Restaurants signup Kafka error');
    } else {
      response.writeHead(result.status, {
        'Content-Type': result.header,
      });
      console.log(result.content);
      response.end(result.content);
    }
  });
  /*
  Orders.find({ cid: request.params.cid }, (error, results) => {
    if (error) {
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      console.log('Error fetching orders');
      response.end('Error fetching orders');
    } else if (results) {
      response.writeHead(200, {
        'Content-Type': 'application/json',
      });
      response.end(JSON.stringify(results));
    } else {
      response.writeHead(400, {
        'Content-Type': 'text/plain',
      });
      response.end('Could not find orders');
    }
  });
  */
});

// get an order
router.get('/:oid', (request, response) => {
  console.log('Endpoint GET: Get a particular order');
  console.log('Request Body: ', request.body);
  const data = { ...request.params };
  kafka.make_request('ordersTopic', 'GETORDER', data, (err, result) => {
    console.log('Place order result ', result);
    if (err) {
      console.log('Place new order Kafka error');
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      response.end('Restaurants signup Kafka error');
    } else {
      response.writeHead(result.status, {
        'Content-Type': result.header,
      });
      console.log(result.content);
      response.end(result.content);
    }
  });
  /*
  Orders.findById(request.params.oid, (error, results) => {
    if (error) {
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      console.log('Error fetching orders');
      response.end('Error fetching orders');
    } else if (results) {
      response.writeHead(200, {
        'Content-Type': 'application/json',
      });
      response.end(JSON.stringify(results));
    } else {
      response.writeHead(400, {
        'Content-Type': 'text/plain',
      });
      response.end('Could not find orders');
    }
  });
  */
});

// Update an order's status
router.put('/:oid', (request, response) => {
  console.log('\nEndpoint PUT: Order status update');
  console.log('Request Body: ', request.body);
  const data = { ...request.params, ...request.data };
  kafka.make_request('ordersTopic', 'UPDATEORDER', data, (err, result) => {
    console.log('Place order result ', result);
    if (err) {
      console.log('Place new order Kafka error');
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      response.end('Restaurants signup Kafka error');
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
    ostatus: request.body.ostatus,
  };
  Orders.findByIdAndUpdate(request.params.oid, data, (error, customer) => {
    if (error) {
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      console.log('Error in finding order with ID');
      response.end('Error in finding order with ID');
    } else if (customer) {
      console.log('Sending 200');
      response.writeHead(200, {
        'Content-Type': 'text/plain',
      });
      response.end('Order updated');
    } else {
      response.writeHead(400, {
        'Content-Type': 'text/plain',
      });
      console.log('Order not found');
      response.end('Order not found');
    }
  });
  */
});

module.exports = router;
