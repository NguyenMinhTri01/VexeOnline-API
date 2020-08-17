const mongoose = require('mongoose');
const { SeatSchema } = require('./Seat')

const TicketSchema = new mongoose.Schema({
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  seats: [SeatSchema],
  totalPrice: Number,
  createdAt : {type : Date, default : Date.now},
  updatedAt : Date
})

const Ticket = mongoose.model('Ticket', TicketSchema, 'Ticket');

module.exports = {
  Ticket,
  TicketSchema
}