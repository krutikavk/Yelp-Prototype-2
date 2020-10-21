const mongoose = require('mongoose');

const { Schema } = mongoose;

const eventSchema = new Schema({
  ename: { type: String, unique: true, DropDups: true },
  edescription: { type: String },
  eaddress: { type: String },
  elatitude: { type: Number },
  elongitude: { type: Number },
  edate: { type: Date },
  // May need entire rest object
  rid: { type: String },
  // customers enrolling for event
  customers: [{
    cid: String,
  }],
},
{
  versionKey: false,
});

const eventModel = mongoose.model('event', eventSchema);
module.exports = eventModel;
