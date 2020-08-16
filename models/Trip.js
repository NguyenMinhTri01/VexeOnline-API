const mongoose = require('mongoose');
const {SeatSchema} = require('../models/Seat');

const TripSchema = new mongoose.Schema({
  fromStationId : {
     type: mongoose.Schema.Types.ObjectId,
     ref : 'Station'
  },
  toStationId : {
    type: mongoose.Schema.Types.ObjectId,
    ref : 'Station'
  },
  startTime : {
    type : Date,
    require: true,
    default: Date.now
  },
  seats : [SeatSchema],
  price : {type: Number, default: 0}
});

const Trip = mongoose.model('Trip', TripSchema, "Trip");
module.exports = {
  Trip,
  TripSchema
}