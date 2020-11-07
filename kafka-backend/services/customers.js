/*
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { mongoDB, secret } = require('../Utils/config');
const { checkAuth, auth } = require('../Utils/passport');
const Customers = require('../Models/CustModel');
const Reviews = require('../Models/ReviewModel');
*/
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { mongoDB } = require('../Utils/config');
const Customers = require('../Models/CustModel');
const Reviews = require('../Models/ReviewModel');

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

function getAllCustomers(callback) {
  Customers.find({}, (error, results) => {
    if (error) {
      const response = {
        status: 400,
        header: 'text/plain',
        content: 'Error fetching customers',
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

function signUpCustomer(data, callback) {
  const now = new Date();
  const jsonDate = now.toJSON();
  const joined = new Date(jsonDate);

  bcrypt.hash(data.cpassword, 10, (errHash, hash) => {
    const newCustomer = new Customers({
      cemail: data.cemail,
      cpassword: hash,
      cname: data.cname,
      cjoined: joined,
      clatitude: data.clatitude,
      clongitude: data.clongitude,
      caddress: data.caddress,
    });
    Customers.findOne({ cemail: data.cemail }, (error, customer) => {
      if (error) {
        const response = {
          status: 400,
          header: 'text/plain',
          content: 'Error in finding customer',
        };
        console.log('Error in finding customer');
        callback(null, response);
      } else if (customer) {
        const response = {
          status: 400,
          header: 'text/plain',
          content: 'Email ID already registered',
        };
        console.log('Email ID already registered');
        callback(null, response);
      } else {
        newCustomer.save((err) => {
          if (err) {
            const response = {
              status: 400,
              header: 'text/plain',
              content: 'Error saving new customer',
            };
            console.log('Error saving new customer');
            callback(null, response);
          } else {
            console.log('Successfully added customer to database');
            // return the customer object back
            Customers.findOne({ cemail: data.cemail }, (e, cust) => {
              if (e) {
                const response = {
                  status: 400,
                  header: 'text/plain',
                  content: 'Error in finding customer with email ID',
                };
                console.log('Error in finding customer with email ID');
                callback(null, response);
              } else if (cust) {
                const payload = {
                  // eslint-disable-next-line no-underscore-dangle
                  cid: cust._id,
                  cemail: cust.cemail,
                  cpassword: cust.password,
                  cname: cust.cname,
                  cphone: cust.cphone,
                  cabout: cust.cabout,
                  cjoined: cust.cjoined,
                  cphoto: cust.cphoto,
                  cfavrest: cust.cfavrest,
                  cfavcuisine: cust.favcuisine,
                  cfollowers: (cust.cfollowers === undefined) ? [] : [...cust.cfollowers],
                  cfollowing: (cust.cfollowing === undefined) ? [] : [...cust.cfollowing],
                  clatitude: cust.clatitude,
                  clongitude: cust.clongitude,
                  caddress: cust.caddress,
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
                  content: 'Customer not found',
                };
                console.log('Customer not found');
                callback(null, response);
              }
            });
          }
        });
      }
    });
  });
}

function loginCustomer(data, callback) {
  Customers.findOne({ cemail: data.cemail }, (error, customer) => {
    if (error) {
      const response = {
        status: 400,
        header: 'text/plain',
        content: 'Error in finding customer with email ID',
      };
      console.log('Error in finding customer with email ID');
      callback(null, response);
    } else if (customer) {
      bcrypt.compare(data.cpassword, customer.cpassword, (err, cust) => {
        if (cust === true) {
          const payload = {
            // eslint-disable-next-line no-underscore-dangle
            cid: customer._id,
            cemail: customer.cemail,
            cpassword: customer.password,
            cname: customer.cname,
            cphone: customer.cphone,
            cabout: customer.cabout,
            cjoined: customer.cjoined,
            cphoto: customer.cphoto,
            cfavrest: customer.cfavrest,
            cfavcuisine: customer.favcuisine,
            cfollowers: (customer.cfollowers === undefined) ? [] : [...customer.cfollowers],
            cfollowing: (customer.cfollowing === undefined) ? [] : [...customer.cfollowing],
            clatitude: customer.clatitude,
            clongitude: customer.clongitude,
            caddress: customer.caddress,
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
        content: 'Customer not found',
      };
      console.log('Customer not found');
      callback(null, response);
    }
  });
}

function getOneCustomer(data, callback) {
  Customers.findById(data.cid, (error, customer) => {
    if (error) {
      const response = {
        status: 400,
        header: 'text/plain',
        content: 'Error in finding customer with email ID',
      };
      console.log('Error in finding customer with email ID');
      callback(null, response);
    } else if (customer) {
      const response = {
        status: 200,
        header: 'application/json',
        content: JSON.stringify(customer),
      };
      console.log('Customer found');
      callback(null, response);
    } else {
      const response = {
        status: 400,
        header: 'text/plain',
        content: 'Customer not found',
      };
      console.log('Customer not found');
      callback(null, response);
    }
  });
}

function updateCustomer(data, callback) {
  const updateData = {
    cemail: data.cemail,
    cname: data.cname,
    cphone: data.cphone,
    cabout: data.cabout,
    cphoto: data.cphoto,
    cfavrest: data.cfavrest,
    cfavcuisine: data.cfavcuisine,
  };
  console.log('kafka backend data: ', data);
  Customers.findByIdAndUpdate(data.cid, updateData, (error, customer) => {
    if (error) {
      const response = {
        status: 400,
        header: 'text/plain',
        content: 'Error in finding customer with ID',
      };
      console.log('Error in finding customer with ID');
      callback(null, response);
    } else if (customer) {
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
        content: 'Customer not found',
      };
      console.log('Customer not found');
      callback(null, response);
    }
  });
}

function updatePassCustomer(data, callback) {
  bcrypt.hash(data.cpassword, 10, (e, hash) => {
    const updateData = {
      cpassword: hash,
    };
    Customers.findByIdAndUpdate(data.cid, updateData, (error, customer) => {
      if (error) {
        const response = {
          status: 400,
          header: 'text/plain',
          content: 'Error in finding customer with ID',
        };
        console.log('Error in finding customer with ID');
        callback(null, response);
      } else if (customer) {
        const response = {
          status: 200,
          header: 'text/plain',
          content: 'Customer password updated',
        };
        console.log('Customer password updated');
        callback(null, response);
      } else {
        const response = {
          status: 400,
          header: 'text/plain',
          content: 'Customer not found',
        };
        console.log('Customer not found');
        callback(null, response);
      }
    });
  });
}

function followCustomer(data, callback) {
  Customers.findById(data.cid1, (error, customer1) => {
    if (error) {
      const response = {
        status: 400,
        header: 'text/plain',
        content: 'Error in finding customer1 with ID',
      };
      console.log('Error in finding customer1 with ID');
      callback(null, response);
    } else if (customer1) {
      Customers.findById(data.cid2, (err, customer2) => {
        if (error) {
          const response = {
            status: 400,
            header: 'text/plain',
            content: 'Error in finding customer2 with ID',
          };
          console.log('Error in finding customer2 with ID');
          callback(null, response);
        }
        // console.log('Customer following:', customer2.cfollowing);
        customer2.cfollowers.push(data.cid1);
        customer2.save((er) => {
          if (er) {
            // Customer 2 found
            const response = {
              status: 400,
              header: 'text/plain',
              content: 'Error in saving customer2 followers',
            };
            console.log('Error in saving customer2 followers');
            callback(null, response);
          } else {
            customer1.cfollowing.push(data.cid2);
            customer1.save((e) => {
              if (e) {
                const response = {
                  status: 400,
                  header: 'text/plain',
                  content: 'Error in saving customer1 following',
                };
                console.log('Error in saving customer1 following');
                callback(null, response);
              } else {
                const response = {
                  status: 200,
                  header: 'text/plain',
                  content: 'Operation completed',
                };
                console.log('Operation completed');
                callback(null, response);
              }
            });
          }
        });
      });
    } else {
      const response = {
        status: 400,
        header: 'text/plain',
        content: 'Error in finding customer1 with ID',
      };
      console.log('Error in finding customer1 with ID');
      callback(null, response);
    }
  });
}

function getReviews(data, callback) {
  Reviews.find({ cid: data.cid }, (error, reviews) => {
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

function escapeRegex(text) {
  if (text !== undefined) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }
  return;
}

function searchByName(data, callback) {
  const regex = new RegExp(escapeRegex(data.cname), 'gi');
  Customers.find({ cname: regex }, (error, customer) => {
    if (error) {
      const response = {
        status: 400,
        header: 'text/plain',
        content: 'Error in finding customer with name',
      };
      console.log('Error in finding customer with name');
      callback(null, response);
    } else if (customer) {
      const response = {
        status: 200,
        header: 'application/json',
        content: JSON.stringify(customer),
      };
      console.log('Customer found');
      callback(null, response);
    } else {
      const response = {
        status: 400,
        header: 'text/plain',
        content: 'Customer not found',
      };
      console.log('Customer not found');
      callback(null, response);
    }
  });
}

function handleRequest(msg, callback) {
  switch (msg.subTopic) {
    case 'GETALL': {
      console.log('Inside get all customers');
      console.log('Message:', msg);
      getAllCustomers(callback);
      break;
    }

    case 'SIGNUP': {
      console.log('Inside signup customers');
      console.log('Message:', msg);
      signUpCustomer(msg.data, callback);
      break;
    }

    case 'LOGIN': {
      console.log('Inside Login customers');
      console.log('Message:', msg);
      loginCustomer(msg.data, callback);
      break;
    }

    case 'GETONE': {
      console.log('Inside Getone customers');
      console.log('Message:', msg);
      getOneCustomer(msg.data, callback);
      break;
    }

    case 'UPDATE': {
      console.log('Inside update customers');
      console.log('Message:', msg);
      updateCustomer(msg.data, callback);
      break;
    }

    case 'UPDATEPASS': {
      console.log('Inside update password customers');
      console.log('Message:', msg);
      updatePassCustomer(msg.data, callback);
      break;
    }

    case 'FOLLOW': {
      console.log('Inside follow customers');
      console.log('Message:', msg);
      followCustomer(msg.data, callback);
      break;
    }

    case 'GETREVIEWS': {
      console.log('Inside get reviews');
      console.log('Message:', msg);
      getReviews(msg.data, callback);
      break;
    }

    case 'SEARCHNAME': {
      console.log('Inside search by name');
      console.log('Message:', msg);
      searchByName(msg.data, callback);
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
