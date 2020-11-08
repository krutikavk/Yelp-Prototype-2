const mongoose = require('mongoose');
const { mongoDB } = require('../Utils/config');
const Conversations = require('../Models/ConversationModel');

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

function initiate(data, callback) {
  const now = new Date();
  const jsonDate = now.toJSON();
  const tstamp = new Date(jsonDate);

  const message = {
    text: data.text,
    date: tstamp,
    flow: true,
  };
  const messages = [];
  messages.push(message);
  const newConv = new Conversations({
    rid: data.rid,
    rname: data.rname,
    cid: data.cid,
    cname: data.cname,
    latest: tstamp,
    messages,
  });

  newConv.save((error) => {
    if (error) {
      const response = {
        status: 400,
        header: 'text/plain',
        content: 'Error initiating conversation',
      };
      console.log('Error initiating conversation');
      callback(null, response);
    } else {
      Conversations.find({ rid: data.rid, cid: data.cid }, (err, conversation) => {
        if (err) {
          const response = {
            status: 400,
            header: 'text/plain',
            content: 'Error fetching conversation',
          };
          console.log('Error fetching conversation');
          callback(null, response);
        } else {
          const response = {
            status: 200,
            header: 'application/json',
            content: JSON.stringify(conversation),
          };
          console.log('Sending 200');
          callback(null, response);
        }
      });
    }
  });
}

function checkIfConvExists(data, callback) {
  Conversations.find({ rid: data.rid, cid: data.cid }, (err, conversation) => {
    if (err) {
      const response = {
        status: 400,
        header: 'text/plain',
        content: 'Error fetching conversation',
      };
      console.log('Error fetching conversation');
      callback(null, response);
    } else if (conversation) {
      const response = {
        status: 400,
        header: 'text/plain',
        content: 'Conversation already exists',
      };
      console.log('Conversation already exists');
      callback(null, response);
    } else {
      const response = {
        status: 200,
        header: 'text/plain',
        content: 'Conversation not present',
      };
      console.log('Conversation not present');
      callback(null, response);
    }
  });
}

function addNewMsg(data, callback) {
  Conversations.findById(data.convid, (error, conversation) => {
    if (error) {
      const response = {
        status: 400,
        header: 'text/plain',
        content: 'Error finding conversation',
      };
      console.log('Error finding conversation');
      callback(null, response);
    } else if (conversation) {
      const { messages } = conversation;
      const now = new Date();
      const jsonDate = now.toJSON();
      const tstamp = new Date(jsonDate);
      const incoming = {
        text: data.text,
        date: tstamp,
        flow: data.flow,
      };
      messages.push(incoming);
      const updateData = {
        rid: data.rid,
        cid: data.cid,
        latest: tstamp,
        messages,
      };
      // sending { new: true } as option returns updated object
      Conversations.findByIdAndUpdate(data.convid, updateData, { new: true }, (err, conv) => {
        if (err) {
          const response = {
            status: 400,
            header: 'text/plain',
            content: 'Error adding to conversation',
          };
          console.log('Error adding to conversation');
          callback(null, response);
        } else {
          console.log('Updated conversation: ', conv);
          const response = {
            status: 200,
            header: 'application/json',
            content: JSON.stringify(conv),
          };
          console.log('Message sent');
          callback(null, response);
        }
      });
    } else {
      const response = {
        status: 400,
        header: 'text/plain',
        content: 'Error finding conversation',
      };
      console.log('Error finding conversation');
      callback(null, response);
    }
  });
}

function getConversation(data, callback) {
  Conversations.findById(data.convid, (error, conversation) => {
    if (error) {
      const response = {
        status: 400,
        header: 'text/plain',
        content: 'Error finding conversation',
      };
      console.log('Error finding conversation');
      callback(null, response);
    } else if (conversation) {
      const response = {
        status: 200,
        header: 'application/json',
        content: JSON.stringify(conversation),
      };
      console.log('Message sent');
      callback(null, response);
    } else {
      const response = {
        status: 400,
        header: 'text/plain',
        content: 'No conversation found',
      };
      console.log('No conversation found');
      callback(null, response);
    }
  });
}

function getConvForCust(data, callback) {
  Conversations
    .find({ cid: data.cid })
    .sort({ latest: -1 })
    .exec((error, conversations) => {
      if (error) {
        const response = {
          status: 400,
          header: 'text/plain',
          content: 'Error posting message',
        };
        console.log('Error posting message');
        callback(null, response);
      } else if (conversations) {
        const response = {
          status: 200,
          header: 'application/json',
          content: JSON.stringify(conversations),
        };
        console.log('Sending 200: ', conversations);
        callback(null, response);
      } else {
        const response = {
          status: 400,
          header: 'text/plain',
          content: 'Conversations not found',
        };
        console.log('Conversations not found');
        callback(null, response);
      }
    });
}

function getConvForRest(data, callback) {
  Conversations
    .find({ rid: data.rid })
    .sort({ latest: -1 })
    .exec((error, conversations) => {
      if (error) {
        const response = {
          status: 400,
          header: 'text/plain',
          content: 'Error posting message',
        };
        console.log('Error posting message');
        callback(null, response);
      } else if (conversations) {
        const response = {
          status: 200,
          header: 'application/json',
          content: JSON.stringify(conversations),
        };
        console.log('Sending 200: ', conversations);
        callback(null, response);
      } else {
        const response = {
          status: 400,
          header: 'text/plain',
          content: 'Conversations not found',
        };
        console.log('Conversations not found');
        callback(null, response);
      }
    });
}

function handleRequest(msg, callback) {
  switch (msg.subTopic) {
    case 'INITIATE': {
      console.log('Inside get all restaurants');
      console.log('Message:', msg);
      initiate(msg.data, callback);
      break;
    }

    case 'CHECKIFCONVEXISTS': {
      console.log('Inside signup restaurants');
      console.log('Message:', msg);
      checkIfConvExists(msg.data, callback);
      break;
    }

    case 'ADDNEWMSG': {
      console.log('Inside Login restaurants');
      console.log('Message:', msg);
      addNewMsg(msg.data, callback);
      break;
    }

    case 'GETCONV': {
      console.log('Inside Login restaurants');
      console.log('Message:', msg);
      getConversation(msg.data, callback);
      break;
    }

    case 'GETCONVCUST': {
      console.log('Inside Getone restaurants');
      console.log('Message:', msg);
      getConvForCust(msg.data, callback);
      break;
    }

    case 'GETCONVREST': {
      console.log('Inside update restaurants');
      console.log('Message:', msg);
      getConvForRest(msg.data, callback);
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