const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { mongoDB, secret } = require('../Utils/config');
const { checkAuth, auth } = require('../Utils/passport');
const Events = require('../Models/EventModel');

auth();

const router = express.Router();

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  poolSize: 500,
  bufferMaxEntries: 0,
  useFindAndModify: false,
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

router.post('/', (request, response) => {
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
    ecustomers: [...request.body.ecustomers],
  });

  console.log('Endpoint POST: Add event');
  console.log('Request Body: ', request.body);
  console.log('data incoming: ', newEvent);
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
});

module.exports = router;