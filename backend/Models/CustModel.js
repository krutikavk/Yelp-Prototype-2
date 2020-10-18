const mongoose = require('mongoose');
// Outdated package mongoose-auto-increment, use mongoose-sequence instead
// const autoIncrement = require('mongoose-auto-increment');
const autoIncrement = require('mongoose-sequence')(mongoose);
// const { mongoDB } = require('./config');
// eslint-disable-next-line prefer-destructuring
const Schema = mongoose.Schema;

const custSchema = new Schema({
  cid: Number,
  cemail: { type: String },
  cpassword: { type: String },
  cname: { type: String },
  cphone: { type: Number },
  cabout: { type: String },
  cjoined: { type: Date, default: Date.now },
  cphoto: { type: String },
  cfavrest: { type: String },
  cfavcuisine: { type: String },
},
{
  versionKey: false,
});

// for mongoose-auto-increment
// custSchema.plugin(autoIncrement.plugin, 'customer');
const custModel = mongoose.model('customer', custSchema);
custSchema.plugin(autoIncrement, { inc_field: 'cid' });
module.exports = custModel;
