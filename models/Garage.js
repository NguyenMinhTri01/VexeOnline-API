const mongoose = require('mongoose');
const urlSlug = require('url-slug');

const GarageSchema = new mongoose.Schema({
  name: { type : String, required : true},
  slug : {type : String},
  avatar : {type : String, default : "/imageDefault/no-image_ljozla"},
  address: { type : String, required: true},
  status : {type: Boolean, default : true},
  content : {type : String, default : ''},
  createdAt : {type : Date, default : Date.now},
  updatedAt : {type : Date}
})
GarageSchema.pre('save', function beforeSave(next) {
  const garage = this;
  if (!garage.isModified("name")) return next();
  garage.slug = urlSlug(garage.name);
  next();
});

const Garage = mongoose.model('Station', GarageSchema, "Station");
module.exports = {
  GarageSchema,
  Garage
}