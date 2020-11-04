const mongoose = require('mongoose');
const { mongoDB } = require('../Utils/config');
const Orders = require('../Models/OrderModel');
const Reviews = require('../Models/ReviewModel');
const Dishes = require('../Models/DishModel');

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

function placeOrder(data, callback) {
  const now = new Date();
  const jsonDate = now.toJSON();
  const ordertime = new Date(jsonDate);
  const newOrder = new Orders({
    cid: data.cid,
    rid: data.rid,
    ooption: data.ooption,
    ostatus: data.ostatus,
    otype: data.otype,
    otime: ordertime,
    oaddress: data.oaddress,
    odishes: [...data.odishes],
  });

  newOrder.save((error) => {
    if (error) {
      const response = {
        status: 400,
        header: 'text/plain',
        content: 'Error saving new order',
      };
      console.log('Error saving new order');
      callback(null, response);
    } else {
      console.log('Successfully placed order');
      Orders
        .find({ cid: data.cid, rid: data.rid })
        .select({})
        .sort({ otime: -1 })
        .limit(1)
        .exec((err, order) => {
          if (err) {
            const response = {
              status: 400,
              header: 'text/plain',
              content: 'Error finding placed order',
            };
            console.log('Error finding placed order');
            callback(null, response);
          } else if (order) {
            const response = {
              status: 200,
              header: 'application/json',
              content: JSON.stringify(order),
            };
            console.log('Sending 200');
            callback(null, response);
          } else {
            const response = {
              status: 400,
              header: 'text/plain',
              content: 'Error finding placed order',
            };
            console.log('Error finding placed order');
            callback(null, response);
          }
        });
    }
  });
}

function getOrdersForRest(data, callback) {
  Orders.find({ rid: data.rid }, (error, orders) => {
    if (error) {
      const response = {
        status: 400,
        header: 'text/plain',
        content: 'Error fetching orders',
      };
      console.log('Error fetching orders');
      callback(null, response);
    } else if (orders) {
      const response = {
        status: 200,
        header: 'application/json',
        content: JSON.stringify(orders),
      };
      console.log('Sending 200');
      callback(null, response);
    } else {
      const response = {
        status: 400,
        header: 'text/plain',
        content: 'Could not find orders',
      };
      console.log('Could not find orders');
      callback(null, response);
    }
  });
}

function getOrdersForCust(data, callback) {
  Orders.find({ cid: data.cid }, (error, orders) => {
    if (error) {
      const response = {
        status: 400,
        header: 'text/plain',
        content: 'Error fetching orders',
      };
      console.log('Error fetching orders');
      callback(null, response);
    } else if (orders) {
      const response = {
        status: 200,
        header: 'application/json',
        content: JSON.stringify(orders),
      };
      console.log('Sending 200');
      callback(null, response);
    } else {
      const response = {
        status: 400,
        header: 'text/plain',
        content: 'Could not find orders',
      };
      console.log('Could not find orders');
      callback(null, response);
    }
  });
}

function getOrder(data, callback) {
  Orders.findById(data.oid, (error, orders) => {
    if (error) {
      const response = {
        status: 400,
        header: 'text/plain',
        content: 'Error fetching orders',
      };
      console.log('Error fetching orders');
      callback(null, response);
    } else if (orders) {
      const response = {
        status: 200,
        header: 'application/json',
        content: JSON.stringify(orders),
      };
      console.log('Sending 200');
      callback(null, response);
    } else {
      const response = {
        status: 400,
        header: 'text/plain',
        content: 'Could not find orders',
      };
      console.log('Could not find orders');
      callback(null, response);
    }
  });
}

function updateOrder(data, callback) {
  const updateData = {
    ostatus: data.ostatus,
  };
  Orders.findByIdAndUpdate(data.oid, updateData, (error, order) => {
    if (error) {
      const response = {
        status: 400,
        header: 'text/plain',
        content: 'Error fetching order with oid',
      };
      console.log('Error fetching order with oid');
      callback(null, response);
    } else if (order) {
      const response = {
        status: 200,
        header: 'application/json',
        content: JSON.stringify(order),
      };
      console.log('Sending 200');
      callback(null, response);
    } else {
      const response = {
        status: 400,
        header: 'text/plain',
        content: 'Could not find order',
      };
      console.log('Could not find order');
      callback(null, response);
    }
  });
}

function handleRequest(msg, callback) {
  switch (msg.subTopic) {
    case 'PLACEORDER': {
      console.log('Inside get all restaurants');
      console.log('Message:', msg);
      placeOrder(msg.data, callback);
      break;
    }

    case 'ORDERSFORREST': {
      console.log('Inside signup restaurants');
      console.log('Message:', msg);
      getOrdersForRest(msg.data, callback);
      break;
    }

    case 'ORDERSFORCUST': {
      console.log('Inside Login restaurants');
      console.log('Message:', msg);
      getOrdersForCust(msg.data, callback);
      break;
    }

    case 'GETORDER': {
      console.log('Inside Getone restaurants');
      console.log('Message:', msg);
      getOrder(msg.data, callback);
      break;
    }

    case 'UPDATEORDER': {
      console.log('Inside update restaurants');
      console.log('Message:', msg);
      updateOrder(msg.data, callback);
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
