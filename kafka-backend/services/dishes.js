const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { mongoDB } = require('../Utils/config');
const Restaurants = require('../Models/RestModel');
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

function addDish(data, callback) {
  const newDish = new Dishes({
    rid: data.rid,
    dname: data.dname,
    dingredients: data.dingredients,
    dprice: data.dprice,
    dcategory: data.dcategory,
    durl: data.durl,
  });

  // id of new dish is newDish._id
  console.log('ID of new dish: ', newDish._id);
  newDish.save((err) => {
    if (err) {
      const response = {
        status: 400,
        header: 'text/plain',
        content: 'Error in saving new dish',
      };
      console.log('Error in saving new dish');
      callback(null, response);
    } else {
      // Save ID of dish to restaurant model
      const response = {
        status: 200,
        header: 'text/plain',
        content: 'Added new dish',
      };
      console.log('Added new dish');
      callback(null, response);
    }
  });
}

function getAllForRest(data, callback) {
  Dishes.find({ rid: data.rid }, (error, dishes) => {
    if (error) {
      const response = {
        status: 400,
        header: 'text/plain',
        content: 'Error in finding dishes',
      };
      console.log('Error in finding dishes');
      callback(null, response);
    } else if (dishes) {
      const response = {
        status: 200,
        header: 'application/json',
        content: JSON.stringify(dishes),
      };
      console.log('Sending 200');
      callback(null, response);
    } else {
      const response = {
        status: 400,
        header: 'text/plain',
        content: 'Error in finding dishes',
      };
      console.log('Error in finding dishes');
      callback(null, response);
    }
  });
}

function editDish(data, callback) {
  const updateData = {
    dname: data.dname,
    dingredients: data.dingredients,
    dprice: data.dprice,
    ddescription: data.ddescription,
    dcategory: data.dcategory,
  };
  Dishes.findByIdAndUpdate(data.did, updateData, (error) => {
    if (error) {
      const response = {
        status: 400,
        header: 'text/plain',
        content: 'Error in updating dish',
      };
      console.log('Error in updating dish');
      callback(null, response);
    } else {
      const response = {
        status: 200,
        header: 'text/plain',
        content: 'Updated dish',
      };
      console.log('Updated dish');
      callback(null, response);
    }
  });
}

function handleRequest(msg, callback) {
  switch (msg.subTopic) {
    case 'ADDDISH': {
      console.log('Inside get all restaurants');
      console.log('Message:', msg);
      addDish(msg.data, callback);
      break;
    }

    case 'GETALLFORREST': {
      console.log('Inside signup restaurants');
      console.log('Message:', msg);
      getAllForRest(msg.data, callback);
      break;
    }

    case 'EDITDISH': {
      console.log('Inside Login restaurants');
      console.log('Message:', msg);
      editDish(msg.data, callback);
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
