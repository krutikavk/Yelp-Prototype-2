const config = {
  secret: 'cmpe273_secret_key',
  frontendURL: process.env.REACT_APP_FRONTEND,
  mongoDB: 'mongodb+srv://admin:admin@yelp2.t9z29.mongodb.net/yelp-2?retryWrites=true&w=majority',
};

module.exports = config;
