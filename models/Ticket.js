const mongoose = require('mongoose');
const { SeatSchema } = require('./Seat')

const TicketSchema = new mongoose.Schema({
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  code : {type : String , unique : true, required : true},
  email : {type : String, required : true},
  customerName: {type : String, required : true},
  phone : {type : String, required : true},
  note : String,
  seats: [SeatSchema],
  totalPrice: Number,
  statusTicket : {type: Number, default: 0},
  createdAt : {type : Date, default : Date.now},
  updatedAt : Date
})

const Ticket = mongoose.model('Ticket', TicketSchema, 'Ticket');

module.exports = {
  Ticket,
  TicketSchema
}