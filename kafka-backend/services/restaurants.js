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

function getAllRestaurants(callback) {
  Restaurants.find({}, (error, results) => {
    if (error) {
      const response = {
        status: 400,
        header: 'text/plain',
        content: 'Error fetching restaurants',
      };
      callback(null, response);
    } else {
      console.log('Sending 200');
      const response = {
        status: 200,
        header: 'application/json',
        content: JSON.stringify(results),
      };
      callback(null, response);
    }
  });
}

function getOneRestaurant(data, callback) {
  Restaurants.findById(data.rid, (error, restaurant) => {
    if (error) {
      const response = {
        status: 400,
        header: 'text/plain',
        content: 'Error in finding restaurant with email ID',
      };
      console.log('Error in finding restaurant with email ID');
      callback(null, response);
    } else if (restaurant) {
      const response = {
        status: 200,
        header: 'application/json',
        content: JSON.stringify(restaurant),
      };
      console.log('Restaurant found');
      callback(null, response);
    } else {
      const response = {
        status: 400,
        header: 'text/plain',
        content: 'Restaurant not found',
      };
      console.log('Restaurant not found');
      callback(null, response);
    }
  });
}

function signUpRestaurant(data, callback) {
  bcrypt.hash(data.rpassword, 10, (errHash, hash) => {
    const newRestaurant = new Restaurants({
      remail: data.remail,
      rpassword: hash,
      rname: data.rname,
    });
    Restaurants.findOne({ remail: data.remail }, (error, restaurant) => {
      if (error) {
        const response = {
          status: 400,
          header: 'text/plain',
          content: 'Error in finding restaurant',
        };
        console.log('Error in finding restaurant');
        callback(null, response);
      } else if (restaurant) {
        const response = {
          status: 400,
          header: 'text/plain',
          content: 'Email ID already registered',
        };
        console.log('Email ID already registered');
        callback(null, response);
      } else {
        newRestaurant.save((err) => {
          if (err) {
            const response = {
              status: 400,
              header: 'text/plain',
              content: 'Error in saving new restaurant',
            };
            console.log('Error in saving new restaurant');
            callback(null, response);
          } else {
            console.log('Successfully added restaurant to database');
            // return the restaurant object back
            Restaurants.findOne({ remail: data.remail }, (e, rest) => {
              if (e) {
                const response = {
                  status: 400,
                  header: 'text/plain',
                  content: 'Error in finding restaurant with email ID',
                };
                console.log('Error in finding restaurant with email ID');
                callback(null, response);
              } else if (rest) {
                const payload = {
                  // eslint-disable-next-line no-underscore-dangle
                  rid: rest._id,
                  remail: rest.remail,
                  rpassword: rest.rpassword,
                  rname: rest.rname,
                  rphone: rest.rphone,
                  rabout: rest.rabout,
                  rphoto: [...rest.rphoto],
                  rlatitude: rest.rlatitude,
                  rlongitude: rest.rlatitude,
                  raddress: rest.raddress,
                  rcuisine: rest.rcuisine,
                  rdelivery: rest.rdelivery,
                  rhours: { ...rest.rhours },
                  rrating: rest.rrating,
                };
                const response = {
                  status: 200,
                  header: 'text/plain',
                  content: 'Signup successful',
                  payload,
                };
                console.log('Signup successful');
                callback(null, response);
              } else {
                const response = {
                  status: 400,
                  header: 'text/plain',
                  content: 'Restaurant not found',
                };
                console.log('Restaurant not found');
                callback(null, response);
              }
            });
          }
        });
      }
    });
  });
}

function loginRestaurant(data, callback) {
  Restaurants.findOne({ remail: data.remail }, (error, restaurant) => {
    if (error) {
      const response = {
        status: 400,
        header: 'text/plain',
        content: 'Error in finding restaurant with email ID',
      };
      console.log('Error in finding restaurant with email ID');
      callback(null, response);
    } else if (restaurant) {
      bcrypt.compare(data.rpassword, restaurant.rpassword, (err, result) => {
        if (result === true) {
          const payload = {
          // eslint-disable-next-line no-underscore-dangle
            rid: restaurant._id,
            remail: restaurant.remail,
            rpassword: restaurant.rpassword,
            rname: restaurant.rname,
            rphone: restaurant.rphone,
            rabout: restaurant.rabout,
            rphoto: [...restaurant.rphoto],
            rlatitude: restaurant.rlatitude,
            rlongitude: restaurant.rlatitude,
            raddress: restaurant.raddress,
            rcuisine: restaurant.rcuisine,
            rdelivery: restaurant.rdelivery,
            rhours: restaurant.rhours,
            rrating: restaurant.rrating,
          };
          const response = {
            status: 200,
            header: 'text/plain',
            content: 'Login successful',
            payload,
          };
          console.log('kafka backend payload: ', payload);
          console.log('Login successful');
          callback(null, response);
        } else {
          const response = {
            status: 400,
            header: 'text/plain',
            content: 'Incorrect login',
          };
          console.log('Incorrect login');
          callback(null, response);
        }
      });
    } else {
      const response = {
        status: 400,
        header: 'text/plain',
        content: 'Restaurant not found',
      };
      console.log('Restaurant not found');
      callback(null, response);
    }
  });
}

function updateRestaurant(data, callback) {
  const updateData = {
    remail: data.remail,
    rname: data.rname,
    rphone: data.rphone,
    rabout: data.rabout,
    rphoto: data.rphoto,
    rlatitude: data.rlatitude,
    rlongitude: data.rlongitude,
    raddress: data.raddress,
    rcuisine: data.rcuisine,
    rdelivery: data.rdelivery,
    rhours: data.rhours,
    rrating: data.rrating,
  };
  Restaurants.findByIdAndUpdate(data.rid, updateData, (error, restaurant) => {
    if (error) {
      const response = {
        status: 400,
        header: 'text/plain',
        content: 'Error in finding restaurant with ID',
      };
      console.log('Error in finding restaurant with ID');
      callback(null, response);
    } else if (restaurant) {
      const response = {
        status: 200,
        header: 'text/plain',
        content: 'Customer updated',
      };
      console.log('Customer updated');
      callback(null, response);
    } else {
      const response = {
        status: 400,
        header: 'text/plain',
        content: 'Restaurant not found',
      };
      console.log('Restaurant not found');
      callback(null, response);
    }
  });
}

function updatePassRestaurant(data, callback) {
  bcrypt.hash(data.rpassword, 10, (e, hash) => {
    const updateData = {
      rpassword: hash,
    };
    Restaurants.findByIdAndUpdate(data.rid, updateData, (error, restaurant) => {
      if (error) {
        const response = {
          status: 400,
          header: 'text/plain',
          content: 'Error in finding customer with ID',
        };
        console.log('Error in finding customer with ID');
        callback(null, response);
      } else if (restaurant) {
        const response = {
          status: 200,
          header: 'text/plain',
          content: 'Restaurant password updated',
        };
        console.log('Restaurant password updated');
        callback(null, response);
      } else {
        const response = {
          status: 400,
          header: 'text/plain',
          content: 'Restaurant not found',
        };
        console.log('Restaurant not found');
        callback(null, response);
      }
    });
  });
}

function addReview(data, callback) {
  const now = new Date();
  const jsonDate = now.toJSON();
  const current = new Date(jsonDate);

  const newReview = new Reviews({
    retext: data.retext,
    rerating: data.rerating,
    rdate: current,
    cid: data.cid,
    rid: data.rid,
  });

  newReview.save((error) => {
    if (error) {
      const response = {
        status: 400,
        header: 'text/plain',
        content: 'Error saving review',
      };
      console.log('Error saving review');
      callback(null, response);
    } else {
      const response = {
        status: 200,
        header: 'text/plain',
        content: 'Review added',
      };
      console.log('Review added');
      callback(null, response);
    }
  });
}

function getReviews(data, callback) {
  Reviews.find({ rid: data.rid }, (error, reviews) => {
    if (error) {
      const response = {
        status: 400,
        header: 'text/plain',
        content: 'Error in finding reviews',
      };
      console.log('Error in finding reviews');
      callback(null, response);
    } else if (reviews) {
      const response = {
        status: 200,
        header: 'application/json',
        content: JSON.stringify(reviews),
      };
      console.log('Sending 200');
      callback(null, response);
    } else {
      const response = {
        status: 400,
        header: 'text/plain',
        content: 'Error in finding reviews',
      };
      console.log('Error in finding reviews');
      callback(null, response);
    }
  });
}

function getRating(data, callback) {
  Reviews.aggregate([
    {
      $match:
      {
        rid: data.rid,
      },
    },
    {
      $group: {
        _id: '_id',
        'AVG(rerating)': {
          $avg: '$rerating',
        },
      },
    }]).exec((error, result) => {
    if (error) {
      const response = {
        status: 400,
        header: 'text/plain',
        content: 'Error getting average',
      };
      console.log('Error getting average');
      callback(null, response);
    } else {
      const response = {
        status: 200,
        header: 'application/json',
        content: JSON.stringify(result),
      };
      console.log('Sending 200');
      callback(null, response);
    }
  });
}

function searchByDish(data, callback) {
  Dishes
    .find({ dname: data.dname })
    .select('rid')
    .distinct('rid', (error, results) => {
      if (error) {
        const response = {
          status: 400,
          header: 'text/plain',
          content: 'Error getting average',
        };
        console.log('Error getting average');
        callback(null, response);
      } else {
        const response = {
          status: 200,
          header: 'application/json',
          content: JSON.stringify(results),
        };
        console.log('Sending 200');
        callback(null, response);
      }
    });
}

function searchByCuisine(data, callback) {
  Restaurants.find({ rcuisine: data.rcuisine }, (error, restaurants) => {
    if (error) {
      const response = {
        status: 400,
        header: 'text/plain',
        content: 'Error searching restaurants',
      };
      console.log('Error searching restaurants');
      callback(null, response);
    } else if (restaurants) {
      const response = {
        status: 200,
        header: 'application/json',
        content: JSON.stringify(restaurants),
      };
      console.log('Sending 200');
      callback(null, response);
    } else {
      const response = {
        status: 400,
        header: 'text/plain',
        content: 'No restaurants found',
      };
      console.log('No restaurants found');
      callback(null, response);
    }
  });
}

function searchByDelivery(data, callback) {
  Restaurants.find({ rdelivery: data.rdelivery }, (error, restaurants) => {
    if (error) {
      const response = {
        status: 400,
        header: 'text/plain',
        content: 'Error searching restaurants',
      };
      console.log('Error searching restaurants');
      callback(null, response);
    } else if (restaurants) {
      const response = {
        status: 200,
        header: 'application/json',
        content: JSON.stringify(restaurants),
      };
      console.log('Sending 200');
      callback(null, response);
    } else {
      const response = {
        status: 400,
        header: 'text/plain',
        content: 'No restaurants found',
      };
      console.log('No restaurants found');
      callback(null, response);
    }
  });
}

function handleRequest(msg, callback) {
  switch (msg.subTopic) {
    case 'GETALL': {
      console.log('Inside get all restaurants');
      console.log('Message:', msg);
      getAllRestaurants(callback);
      break;
    }

    case 'SIGNUP': {
      console.log('Inside signup restaurants');
      console.log('Message:', msg);
      signUpRestaurant(msg.data, callback);
      break;
    }

    case 'LOGIN': {
      console.log('Inside Login restaurants');
      console.log('Message:', msg);
      loginRestaurant(msg.data, callback);
      break;
    }

    case 'GETONE': {
      console.log('Inside Getone restaurants');
      console.log('Message:', msg);
      getOneRestaurant(msg.data, callback);
      break;
    }

    case 'UPDATE': {
      console.log('Inside update restaurants');
      console.log('Message:', msg);
      updateRestaurant(msg.data, callback);
      break;
    }

    case 'UPDATEPASS': {
      console.log('Inside update password restaurants');
      console.log('Message:', msg);
      updatePassRestaurant(msg.data, callback);
      break;
    }

    case 'FOLLOW': {
      console.log('Inside follow restaurants');
      console.log('Message:', msg);

      break;
    }

    case 'ADDREVIEW': {
      console.log('Inside add reviews restaurant');
      console.log('Message:', msg);
      addReview(msg.data, callback);
      break;
    }

    case 'GETREVIEWS': {
      console.log('Inside get reviews restaurant');
      console.log('Message:', msg);
      getReviews(msg.data, callback);
      break;
    }

    case 'GETRATING': {
      console.log('Inside get average rating restaurant');
      console.log('Message:', msg);
      getRating(msg.data, callback);
      break;
    }

    case 'SEARCHBYDISH': {
      console.log('Inside restaurant search by Dish');
      console.log('Message:', msg);
      searchByDish(msg.data, callback);
      break;
    }

    case 'SEARCHBYCUISINE': {
      console.log('Inside restaurant search by Cuisine');
      console.log('Message:', msg);
      searchByCuisine(msg.data, callback);
      break;
    }

    case 'SEARCHBYDELIVERY': {
      console.log('Inside restaurant search by Delivery');
      console.log('Message:', msg);
      searchByDelivery(msg.data, callback);
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
