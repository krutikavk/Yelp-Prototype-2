const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { mongoDB, secret } = require('../Utils/config');
const { checkAuth, auth } = require('../Utils/passport');
const Conversations = require('../Models/ConversationModel');

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

// Initiate a conversation
router.post('/', (request, response) => {
  // Need from body:
  /*
    rid
    cid
    text
    flow: true by default for first conversation
  */
  const now = new Date();
  const jsonDate = now.toJSON();
  const tstamp = new Date(jsonDate);

  const message = {
    text: request.body.text,
    date: tstamp,
    flow: true,
  };
  const messages = [];
  messages.push(message);
  const newConv = new Conversations({
    rid: request.body.rid,
    cid: request.body.cid,
    latest: tstamp,
    messages,
  });

  console.log('\nEndpoint POST: initiate a conversation');
  console.log('Req Body: ', request.body);

  newConv.save((error) => {
    if (error) {
      response.writeHead(400, {
        'Content-Type': 'text/plain',
      });
      console.log('Error initiating conversation');
      response.end('Error initiating conversation');
    } else {
      Conversations.find({ rid: request.body.rid, cid: request.body.cid }, (err, conversation) => {
        if (err) {
          response.writeHead(200, {
            'Content-Type': 'text/plain',
          });
          console.log('Error fetching conversation');
          response.end('Error fetching conversation');
        } else {
          response.writeHead(200, {
            'Content-Type': 'application/json',
          });
          response.end(JSON.stringify(conversation));
        }
      });
    }
  });
});

// Check if conversation between rid/cid already exists
router.post('/check', (request, response) => {
  console.log('\nEndpoint POST: check conversation exists');
  console.log('Req Body: ', request.body);
  Conversations.find({ rid: request.body.rid, cid: request.body.cid }, (err, conversation) => {
    if (err) {
      response.writeHead(200, {
        'Content-Type': 'text/plain',
      });
      console.log('Error fetching conversation');
      response.end('Error fetching conversation');
    } else if (conversation) {
      response.writeHead(400, {
        'Content-Type': 'text/plain',
      });
      response.end('Conversation already exists');
    } else {
      response.writeHead(200, {
        'Content-Type': 'text/plain',
      });
      response.end('Conversation not present');
    }
  });
});

// Add a message to an existing conversation
router.post('/:convid', (request, response) => {
  console.log('\nEndpoint POST: initiate a conversation');
  console.log('Req Body: ', request.body);

  // body has rid, cid, flow
  Conversations.findById(request.params.convid, (error, conversation) => {
    if (error) {
      response.writeHead(400, {
        'Content-Type': 'text/plain',
      });
      console.log('Error initiating conversation');
      response.end('Error initiating conversation');
    } else if (conversation) {
      const { messages } = conversation;
      const now = new Date();
      const jsonDate = now.toJSON();
      const tstamp = new Date(jsonDate);
      const incoming = {
        text: request.body.text,
        date: tstamp,
        flow: request.body.flow,
      };
      messages.push(incoming);
      const data = {
        rid: request.body.rid,
        cid: request.body.cid,
        latest: tstamp,
        messages,
      };
      Conversations.findByIdAndUpdate(request.params.convid, data, (err) => {
        if (err) {
          response.writeHead(400, {
            'Content-Type': 'text/plain',
          });
          console.log('Error posting message');
          response.end('Error posting message');
        } else {
          response.writeHead(200, {
            'Content-Type': 'text/plain',
          });
          response.end('Message sent');
        }
      });
    } else {
      response.writeHead(400, {
        'Content-Type': 'text/plain',
      });
      console.log('Error initiating conversation');
      response.end('Error initiating conversation');
    }
  });
});

// Get particular conversation
router.get('/:convid', (request, response) => {
  console.log('\nEndpoint GET: all conversations for customer');
  console.log('Req Body: ', request.body);
  Conversations.findById(request.params.convid, (error, conversation) => {
    if (error) {
      response.writeHead(400, {
        'Content-Type': 'text/plain',
      });
      console.log('Error finding conversation');
      response.end('Error finding conversation');
    } else if (conversation) {
      response.writeHead(200, {
        'Content-Type': 'application/json',
      });
      response.end(JSON.stringify(conversation));
    } else {
      response.writeHead(400, {
        'Content-Type': 'text/plain',
      });
      console.log('No conversation found');
      response.end('No conversation found');
    }
  });
});

// Get all conversations for a customer
router.get('/customers/:cid', (request, response) => {
  console.log('\nEndpoint GET: all conversations for customer');
  console.log('Req Body: ', request.body);
  Conversations
    .find({ cid: request.params.cid })
    .sort({ latest: -1 })
    .exec((error, conversations) => {
      if (error) {
        response.writeHead(400, {
          'Content-Type': 'text/plain',
        });
        console.log('Error posting message');
        response.end('Error posting message');
      } else if (conversations) {
        response.writeHead(200, {
          'Content-Type': 'application/json',
        });
        console.log('Returned: ', conversations);
        response.end(JSON.stringify(conversations));
      } else {
        response.writeHead(400, {
          'Content-Type': 'text/plain',
        });
        console.log('Error posting message');
        response.end('Error posting message');
      }
    });
});

// Get all conversations for a restaurant
router.get('/restaurants/:rid', (request, response) => {
  console.log('\nEndpoint GET: all conversations for restaurant');
  console.log('Req Body: ', request.body);
  Conversations.find({ rid: request.params.rid }, (error, conversations) => {
    if (error) {
      response.writeHead(400, {
        'Content-Type': 'text/plain',
      });
      console.log('Error posting message');
      response.end('Error posting message');
    } else if (conversations) {
      response.writeHead(200, {
        'Content-Type': 'application/json',
      });
      console.log('Returned: ', conversations);
      response.end(JSON.stringify(conversations));
    } else {
      response.writeHead(400, {
        'Content-Type': 'text/plain',
      });
      console.log('Error posting message');
      response.end('Error posting message');
    }
  });
});

module.exports = router;
