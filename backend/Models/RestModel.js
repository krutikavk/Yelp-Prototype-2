const mongoose = require('mongoose');

const { Schema } = mongoose;

const restSchema = new Schema({
  remail: { type: String, unique: true, DropDups: true },
  rpassword: { type: String },
  rname: { type: String },
  rphone: { type: Number },
  rabout: { type: String },
  rphoto: [{ type: String }],
  rlocation: { type: String },
  ratitude: { type: Number },
  rlongitude: { type: Number },
  raddress: { type: String },
  rcuisine: { type: String },
  rdelivery: { type: String },
  rdish: [{
    dname: String,
    dingredients: String,
    dprice: Number,
    dcategory: {
      type: String,
      enum: ['Appetizer', 'Salad', 'Main Course', 'Dessert', 'Beverage'],
      default: 'Main Course',
    },
    durl: String,
  }],
  rhours: {
    sunday: Boolean,
    monday: Boolean,
    tuesday: Boolean,
    wednesday: Boolean,
    thursday: Boolean,
    friday: Boolean,
    saturday: Boolean,
    startTime: String,
    endTime: String,
  },
  rrating: { type: Number, default: 0 },
},
{
  versionKey: false,
});

const restModel = mongoose.model('restaurant', restSchema);
module.exports = restModel;
