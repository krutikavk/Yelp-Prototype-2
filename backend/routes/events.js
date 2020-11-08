const express = require('express');
const { checkAuth, auth } = require('../Utils/passport');
const kafka = require('../kafka/client');

auth();

const router = express.Router();

// Add event
router.post('/', (request, response) => {
  console.log('Endpoint POST: Add event');
  console.log('Request Body: ', request.body);
  const data = { ...request.body };

  kafka.make_request('eventsTopic', 'ADDEVENT', data, (err, result) => {
    console.log('Add event result ', result);
    if (err) {
      console.log('Add event Kafka error');
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      response.end('Add event Kafka error');
    } else {
      response.writeHead(result.status, {
        'Content-Type': result.header,
      });
      console.log(result.content);
      response.end(result.content);
    }
  });
  /*
  const temp = (request.body.ecustomers) ? [...request.body.ecustomers] : [];
  const newEvent = new Events({
    ename: request.body.ename,
    edescription: request.body.edescription,
    eaddress: request.body.eaddress,
    elatitude: request.body.elatitude,
    elongitude: request.body.elongitude,
    ephoto: request.body.ephoto,
    edate: request.body.edate,
    rid: request.body.rid,
    rname: request.body.rname,
    ecustomers: temp,
  });

  console.log('Endpoint POST: Add event');
  console.log('Request Body: ', request.body);
  console.log('data incoming: ', newEvent);
  console.log('ecustomers type: ', Array.isArray(request.body.ecustomers));
  console.log('temp:', temp);
  Events.findOne({ ename: request.body.ename }, (error, event) => {
    if (error) {
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      console.log('Error in finding event');
      response.end('Error in finding event');
    } else if (event) {
      response.writeHead(400, {
        'Content-Type': 'text/plain',
      });
      console.log('Event with ename already exists');
      response.end('Event with ename already exists');
    } else {
      newEvent.save((err) => {
        if (err) {
          response.writeHead(500, {
            'Content-Type': 'text/plain',
          });
          console.log('Error in saving new event');
          response.end('Error in saving new event');
        } else {
          Events.findOne({ ename: request.body.ename }, (e, evnt) => {
            if (e) {
              response.writeHead(500, {
                'Content-Type': 'text/plain',
              });
              console.log('Error in finding event with ename');
              response.end('Error in finding event with ename');
            } else if (evnt) {
              const payload = {
                // eslint-disable-next-line no-underscore-dangle
                ename: evnt.ename,
                edescription: evnt.edescription,
                eaddress: evnt.eaddress,
                elatitude: evnt.elatitude,
                elongitude: evnt.elongitude,
                edate: evnt.edate,
                ephoto: evnt.ephoto,
                rid: evnt.rid,
                rname: evnt.rname,
                ecustomers: [...evnt.ecustomers],
              };
              console.log('Event added successfully');
              response.writeHead(200, {
                'Content-Type': 'application/json',
              });
              response.status(200).end(JSON.stringify(payload));
            } else {
              response.writeHead(500, {
                'Content-Type': 'text/plain',
              });
              console.log('Restaurant not found');
              response.end('Restaurant not found');
            }
          });
        }
      });
    }
  });
  */
});

// Get all events
router.get('/', (request, response) => {
  console.log('Endpoint GET: Get all events');
  console.log('Request Body: ', request.body);

  kafka.make_request('eventsTopic', 'GETALL',  request.body, (err, result) => {
    console.log('Get all events result ', result);
    if (err) {
      console.log('Add event Kafka error');
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      response.end('Add event Kafka error');
    } else {
      response.writeHead(result.status, {
        'Content-Type': result.header,
      });
      console.log(result.content);
      response.end(result.content);
    }
  });
  /*
  Events.find({}, (error, result) => {
    if (error) {
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      console.log('Error in saving new event');
      response.end('Error in saving new event');
    } else {
      response.writeHead(200, {
        'Content-Type': 'application/json',
      });
      response.end(JSON.stringify(result));
    }
  });
  */
});

// Get particular event
router.get('/:eid', (request, response) => {
  console.log('Endpoint GET: Get particular event');
  console.log('Request Body: ', request.body);
  const data = { ...request.params };

  kafka.make_request('eventsTopic', 'GETEVENT', data, (err, result) => {
    console.log('Get event result ', result);
    if (err) {
      console.log('Get event Kafka error');
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      response.end('Get event Kafka error');
    } else {
      response.writeHead(result.status, {
        'Content-Type': result.header,
      });
      console.log(result.content);
      response.end(result.content);
    }
  });
  /*
  Events.findById(request.params.eid, (error, event) => {
    if (error) {
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      console.log('Error getting event');
      response.end('Error getting event');
    } else {
      response.writeHead(200, {
        'Content-Type': 'application/json',
      });
      console.log('Event found: ', event);
      response.end(JSON.stringify(event));
    }
  });
  */
});

// Get all events by a restaurant
router.get('/restaurants/:rid', (request, response) => {
  console.log('Endpoint GET: Get all events by a restaurant');
  console.log('Request Body: ', request.body);
  const data = { ...request.params };

  kafka.make_request('eventsTopic', 'GETEVENTSBYREST', data, (err, result) => {
    console.log('Get events by rest result ', result);
    if (err) {
      console.log('Get events by rest Kafka error');
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      response.end('Get events by rest Kafka error');
    } else {
      response.writeHead(result.status, {
        'Content-Type': result.header,
      });
      console.log(result.content);
      response.end(result.content);
    }
  });
  /*
  Events.find({ rid: request.params.rid }, (error, result) => {
    if (error) {
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      console.log('Error in saving new event');
      response.end('Error in saving new event');
    } else {
      response.writeHead(200, {
        'Content-Type': 'application/json',
      });
      response.end(JSON.stringify(result));
    }
  });
  */
});

// Get all events customer is attending
router.get('/customers/:cid', (request, response) => {
  console.log('Endpoint GET: All events customer is attending');
  console.log('Request Body: ', request.body);
  const data = { ...request.params };

  kafka.make_request('eventsTopic', 'GETEVENTSCUSTREG', data, (err, result) => {
    console.log('Get events cust is attending result ', result);
    if (err) {
      console.log('Get events customer is attending Kafka error');
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      response.end('Get events customer is attending Kafka error');
    } else {
      response.writeHead(result.status, {
        'Content-Type': result.header,
      });
      console.log(result.content);
      response.end(result.content);
    }
  });
  /*
  Events.find({}, (error, events) => {
    if (error) {
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      console.log('Error getting events');
      response.end('Error getting events');
    } else if (events) {
      // eslint-disable-next-line prefer-const
      let eventArr = [];
      events.forEach((item) => {
        console.log(item);
        if (item.ecustomers.includes(request.params.cid)) {
          console.log('here');
          eventArr.push(item);
        }
      });
      console.log('eventarr: ', eventArr);
      response.writeHead(200, {
        'Content-Type': 'application/json',
      });
      response.end(JSON.stringify(eventArr));
    } else {
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      console.log('Error getting events');
      response.end('Error getting events');
    }
  });
  */
});

// Get all customers going to an event
router.get('/:eid/customers', (request, response) => {
  console.log('Endpoint POST: All customers attending event');
  console.log('Request Body: ', request.body);
  const data = { ...request.params };

  kafka.make_request('eventsTopic', 'GETCUSTATTENDEVENT', data, (err, result) => {
    console.log('Get custs attending an event result: ', result);
    if (err) {
      console.log('Get events customer is attending Kafka error');
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      response.end('Get events customer is attending Kafka error');
    } else {
      response.writeHead(result.status, {
        'Content-Type': result.header,
      });
      console.log(result.content);
      response.end(result.content);
    }
  });
  /*
  Events
    .findById(request.params.eid)
    .select('ecustomers')
    .exec((err, ecustomers) => {
      if (err) {
        response.writeHead(400, {
          'Content-Type': 'text/plain',
        });
        console.log('Error getting events');
        response.end('Error getting events');
      } else {
        response.writeHead(200, {
          'Content-Type': 'application/json',
        });
        response.end(JSON.stringify(ecustomers));
      }
    });
    */
});


// Register a customer for an event
router.post('/:eid/register', (request, response) => {
  console.log('Endpoint POST: Register customer for event');
  console.log('Request Body: ', request.body);
  const data = { ...request.params, ...request.body }; 

  kafka.make_request('eventsTopic', 'REGISTERFOREVENT', data, (err, result) => {
    console.log('Get custs attending an event result: ', result);
    if (err) {
      console.log('Register for event Kafka error');
      response.writeHead(500, {
        'Content-Type': 'text/plain',
      });
      response.end('Register for event Kafka error');
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
