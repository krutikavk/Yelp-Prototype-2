const mongoose = require('mongoose');

const { Schema } = mongoose;

const dishSchema = new Schema({
  dname: String,
  dingredients: String,
  dprice: Number,
  dcategory: {
    type: String,
    enum: ['Appetizer', 'Salad', 'Main Course', 'Dessert', 'Beverage'],
    default: 'Main Course',
  },
  durl: String,
},
{
  versionKey: false,
});

const dishModel = mongoose.model('restaurant', dishSchema);
module.exports = dishModel;
