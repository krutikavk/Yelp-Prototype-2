const mongoose = require('mongoose');
const { mongoDB } = require('../Utils/config');
const Restaurants = require('../Models/RestModel');
const Reviews = require('../Models/ReviewModel');
const Events = require('../Models/EventModel');

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

function addEvent(data, callback) {
  // might need to check for undefined
  const temp = (data.ecustomers) ? [...data.ecustomers] : [];
  const newEvent = new Events({
    ename: data.ename,
    edescription: data.edescription,
    eaddress: data.eaddress,
    elatitude: data.elatitude,
    elongitude: data.elongitude,
    ephoto: data.ephoto,
    edate: data.edate,
    rid: data.rid,
    rname: data.rname,
    ecustomers: temp,
  });
  Events.findOne({ ename: data.ename }, (error, event) => {
    if (error) {
      const response = {
        status: 400,
        header: 'text/plain',
        content: 'Error in finding event',
      };
      console.log('Error in finding event');
      callback(null, response);
    } else if (event) {
      const response = {
        status: 400,
        header: 'text/plain',
        content: 'Event with ename already exists',
      };
      console.log('Event with ename already exists');
      callback(null, response);
    } else {
      newEvent.save((err) => {
        if (err) {
          const response = {
            status: 400,
            header: 'text/plain',
            content: 'Error in saving new event',
          };
          console.log('Error in saving new event');
          callback(null, response);
        } else {
          Events.findOne({ ename: data.ename }, (e, evnt) => {
            if (e) {
              const response = {
                status: 400,
                header: 'text/plain',
                content: 'Error in finding event with ename',
              };
              console.log('Error in finding event with ename');
              callback(null, response);
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
                ecustomers: (evnt.ecustomers === undefined ? [] : [...evnt.ecustomers]),
              };
              console.log('Event added successfully');
              const response = {
                status: 200,
                header: 'application/json',
                content: JSON.stringify(payload),
              };
              console.log('Error in finding event with ename');
              callback(null, response);
            } else {
              const response = {
                status: 400,
                header: 'text/plain',
                content: 'Event not found',
              };
              console.log('Event not found');
              callback(null, response);
            }
          });
        }
      });
    }
  });
}

function getAllEvents(data, callback) {
  console.log('Endpoint GET: Get all events');
  Events.find({}, (error, result) => {
    if (error) {
      const response = {
        status: 400,
        header: 'text/plain',
        content: 'Error finding event',
      };
      console.log('Error finding event');
      callback(null, response);
    } else {
      console.log('Sending 200');
      const response = {
        status: 200,
        header: 'application/json',
        content: JSON.stringify(result),
      };
      callback(null, response);
    }
  });
}

function getEvent(data, callback) {
  Events.findById(data.eid, (error, event) => {
    if (error) {
      const response = {
        status: 400,
        header: 'text/plain',
        content: 'Error finding event',
      };
      console.log('Error finding event');
      callback(null, response);
    } else {
      console.log('Sending 200');
      const response = {
        status: 200,
        header: 'application/json',
        content: JSON.stringify(event),
      };
      callback(null, response);
    }
  });
}

function getEventsByRest(data, callback) {
  Events.find({ rid: data.rid }, (error, events) => {
    if (error) {
      const response = {
        status: 400,
        header: 'text/plain',
        content: 'Error finding event',
      };
      console.log('Error finding event');
      callback(null, response);
    } else {
      console.log('Sending 200');
      const response = {
        status: 200,
        header: 'application/json',
        content: JSON.stringify(events),
      };
      callback(null, response);
    }
  });
}

function getEventsCustReg(data, callback) {
  Events.find({}, (error, events) => {
    if (error) {
      const response = {
        status: 400,
        header: 'text/plain',
        content: 'Error finding events',
      };
      console.log('Error finding events');
      callback(null, response);
    } else if (events) {
      // eslint-disable-next-line prefer-const
      let eventArr = [];
      events.forEach((item) => {
        console.log(item);
        if (item.ecustomers.includes(data.cid)) {
          console.log('here');
          eventArr.push(item);
        }
      });
      console.log('eventarr: ', eventArr);
      console.log('Sending 200');
      const response = {
        status: 200,
        header: 'application/json',
        content: JSON.stringify(eventArr),
      };
      callback(null, response);
    } else {
      const response = {
        status: 400,
        header: 'text/plain',
        content: 'Error getting events',
      };
      console.log('Error getting events');
      callback(null, response);
    }
  });
}

function getCustomersAttendingEvent(data, callback) {
  Events
    .findById(data.eid)
    .select('ecustomers')
    .exec((err, ecustomers) => {
      if (err) {
        const response = {
          status: 400,
          header: 'text/plain',
          content: 'Error finding events',
        };
        console.log('Error finding events');
        callback(null, response);
      } else {
        const response = {
          status: 400,
          header: 'application/json',
          content: JSON.stringify(ecustomers),
        };
        console.log('Error getting events');
        callback(null, response);
      }
    });
}

function handleRequest(msg, callback) {
  switch (msg.subTopic) {
    case 'ADDEVENT': {
      console.log('Inside add event');
      console.log('Message:', msg);
      addEvent(msg.data, callback);
      break;
    }

    case 'GETALL': {
      console.log('Inside get all events');
      console.log('Message:', msg);
      getAllEvents(msg.data, callback);
      break;
    }

    case 'GETEVENT': {
      console.log('Inside get event');
      console.log('Message:', msg);
      getEvent(msg.data, callback);
      break;
    }

    case 'GETEVENTSBYREST': {
      console.log('Inside get events by restaurant');
      console.log('Message:', msg);
      getEventsByRest(msg.data, callback);
      break;
    }

    case 'GETEVENTSCUSTREG': {
      console.log('Inside get events registered by customer');
      console.log('Message:', msg);
      getEventsCustReg(msg.data, callback);
      break;
    }

    case 'GETCUSTATTENDEVENT': {
      console.log('Inside get customers attending an event');
      console.log('Message:', msg);
      getCustomersAttendingEvent(msg.data, callback);
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

exports.handleRequest = handleRequest;
