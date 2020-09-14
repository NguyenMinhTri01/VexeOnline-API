const { Ticket } = require("../../../../models/Ticket");
const _ = require("lodash")
const { Trip } = require("../../../../models/Trip")
const { Seat } = require("../../../../models/Seat")
const { sendBookTicketEmail } = require("../../../../services/email/bookTicket");

const createTicket = (req, res, next) => {
  const { customerName, email, phone, note, tripId, seatCodes } = req.body
  console.log(seatCodes)
  let newTicket = { customerName, email, phone, note, tripId }
  if (req.user != 'guest' && req.user._id) {
    newTicket = { ...newTicket, userId: req.user._id }
  }
  Trip.findById(tripId)
    .then(trip => {
      if (!trip) return res.status(404).json({ message: 'trip not found' })
      const availableSeatCodes = trip.seats
        .filter(seat => !seat.isBooked)
        .map(seat => seat.code)
      const errSeatCodes = [];
      seatCodes.forEach(code => {
        if (availableSeatCodes.indexOf(code) === -1) errSeatCodes.push(code);
      });
      if (!_.isEmpty(errSeatCodes)) {
        return Promise.reject({
          status: 400,
          message: `${errSeatCodes.join(", ")} is/are not available`
        })
      };
      newTicket = new Ticket({
        ...newTicket,
        seats: seatCodes.map(code => new Seat({ code })),
        totalPrice: trip.price * seatCodes.length
      })
      seatCodes.forEach(code => {
        const seatIndex = trip.seats.findIndex(seat => seat.code === code)
        trip.seats[seatIndex].isBooked = true
      })
      return Promise.all([
        newTicket.save(),
        trip.save()
      ])
    })
    .then(([ticket, trip]) => {
      res.status(200).json(ticket)
    })
    .catch(err => {
      if (err.status) {
        return res.status(err.status).json({ message: err.message })
      }
      return res.status(500).json(err);
    })


};

const getTickets = (req, res, next) => {
  Ticket.find()
    .then(tickets => {
      res.status(200).json(tickets)
    })
}

const getTicketById = (req, res, next) => {

}
module.exports = {
  createTicket,
  getTickets,
  getTicketById
}