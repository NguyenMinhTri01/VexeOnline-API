const mongoose = require('mongoose');
const {ImageSchema} = require('../models/Image');
const VehicleSchema = new mongoose.Schema({
  name: { type : String, required : true},
  numberOfSeats : {type : Number , require : true},
  avatar : {type : String, default : "VexeOnlineMedia/imageDefault/no-image_ljozla"},
  listImages : [ImageSchema],
  utilities : {type : String , default : ''},
  status : {type: Boolean, default : true},
  createdAt : {type : Date, default : Date.now},
  updatedAt : {type : Date}
});
const Vehicle = mongoose.model('Vehicle', VehicleSchema, "Vehicle");
module.exports = {
  VehicleSchema,
  Vehicle
}