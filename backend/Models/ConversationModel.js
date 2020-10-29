const mongoose = require('mongoose');

const { Schema } = mongoose;

// Can add non-essential fields to meta: {} later on
const convSchema = new Schema({
  rid: { type: String },
  cid: { type: String },
  // flow true: restaurant -> customer
  // flow false: customer -> restaurant
  messages: [{ text: String, date: Date, flow: Boolean }],
},
{
  versionKey: false,
});

const convModel = mongoose.model('conversation', convSchema);
module.exports = convModel;
