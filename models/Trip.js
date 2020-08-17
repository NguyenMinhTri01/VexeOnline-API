const mongoose = require('mongoose');
const {SeatSchema} = require('../models/Seat');

const TripSchema = new mongoose.Schema({
  garageId : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "Garage"
  },
  routeId : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "Route"
  },
  vehicleId : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "Vehicle"
  },
  seats : [SeatSchema],
  price : {type: Number, default: 0},
  note : {type : String , default : ''},
  status : {type : Boolean, default : true},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

const Trip = mongoose.model('Trip', TripSchema, "Trip");
module.exports = {
  Trip,
  TripSchema
}