const mongoose = require('mongoose');
// Outdated package mongoose-auto-increment, use mongoose-sequence instead
//const autoIncrement = require('mongoose-sequence')(mongoose);

const { Schema } = mongoose;

const custSchema = new Schema({
  cemail: { type: String, unique: true, DropDups: true },
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
//custSchema.plugin(autoIncrement, { inc_field: '_id' });
module.exports = custModel;
