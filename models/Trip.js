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
  startTime : {type : Date, required : true},
  endTime : {type : Date, required : true},
  seats : [SeatSchema],
  price : {type: Number, required: true},
  note : {type : String , default : ''},
  statusNumber : {type : Number, default : 0},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

const Trip = mongoose.model('Trip', TripSchema, "Trip");
module.exports = {
  Trip,
  TripSchema
}

// statusNumber = 0 Chưa được đặt
// statusNumber = 1 Đã được đặt
// statusNumber = 2 Đang chạy
// statusNumber = 3 đã hoàn thành

// trip only delete and edit when statusNumber = 0
// trip only delete when statusNumber = 3
// admin only update statusNumber to 2 from 3
