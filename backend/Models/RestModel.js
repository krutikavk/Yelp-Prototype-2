const mongoose = require('mongoose');

const { Schema } = mongoose;

// Can add non-essential fields to meta: {} later on
const restSchema = new Schema({
  remail: { type: String, unique: true, DropDups: true },
  rpassword: { type: String },
  rname: { type: String },
  rphone: { type: Number },
  rabout: { type: String },
  rphoto: [{ type: String }],
  rlatitude: { type: Number },
  rlongitude: { type: Number },
  raddress: { type: String },
  rcuisine: { type: String },
  rdelivery: { type: String },
  rdish: [{ type: String }],
  rhours: {
    sunday: { type: Boolean, default: true },
    monday: { type: Boolean, default: true },
    tuesday: { type: Boolean, default: true },
    wednesday: { type: Boolean, default: true },
    thursday: { type: Boolean, default: true },
    friday: { type: Boolean, default: true },
    saturday: { type: Boolean, default: true },
    startTime: { type: String, default: '09:00 hrs' },
    endTime: { type: String, default: '21:00 hrs' },
  },
  rrating: { type: Number, default: 0 },
  revents: [{ type: String }],
},
{
  versionKey: false,
});

const restModel = mongoose.model('restaurant', restSchema);
module.exports = restModel;
