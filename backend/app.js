// const createError = require('http-errors');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const aws = require('aws-sdk');
const cors = require('cors');
const customersRouter = require('./routes/customers');
const restaurantsRouter = require('./routes/restaurants');
const eventsRouter = require('./routes/events');
const ordersRouter = require('./routes/orders');
require('dotenv').config();

// use cors to allow cross origin resource sharing
const app = express();
app.use(cors({ origin: process.env.REACT_APP_FRONTEND, credentials: true }));

// use express session to maintain session data
app.use(session({
  secret: 'cmpe273_kafka_passport_mongo',
  // eslint-disable-next-line max-len
  resave: false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
  // eslint-disable-next-line max-len
  saveUninitialized: false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
  duration: 60 * 60 * 1000, // Overall duration of Session : 30 minutes : 1800 seconds
  activeDuration: 5 * 60 * 1000,
}));

app.use(bodyParser.json());

// Allow Access Control
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.REACT_APP_FRONTEND);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

// Add routes here
app.use('/customers', customersRouter);
app.use('/restaurants', restaurantsRouter);
app.use('/events', eventsRouter);
app.use('/orders', ordersRouter);

aws.config.update({
  region: process.env.region, // Put your aws region here
  accessKeyId: process.env.AWSAccessKeyId,
  secretAccessKey: process.env.AWSSecretKey,
  signatureVersion: 'v4',
});

// reference : https://medium.com/@khelif96/uploading-files-from-a-react-app-to-aws-s3-the-right-way-541dd6be689
// Now lets export this function so we can call it from somewhere else
app.post('/sign_s3', (req, res) => {
  // Create a new instance of S3
  const s3 = new aws.S3();
  const S3_BUCKET = process.env.Bucket;
  const { fileName, fileType } = req.body;
  console.log(req.body);
  // Set up the payload of what we are sending to the S3 api
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 500,
    ContentType: fileType,
    ACL: 'public-read',
  };
  // Make a request to the S3 API to get a signed URL which we can use to upload our file
  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if (err) {
      console.log(err);
      res.json({ success: false, error: err });
    }
    // Data payload of what we are sending back, the url of the signedRequest
    // and a URL where we can access the content after its saved.
    console.log(data);
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`,
    };
    // Send it all back
    res.json({ success: true, data: { returnData } });
  });
});

/*
// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
*/

module.exports = app;
