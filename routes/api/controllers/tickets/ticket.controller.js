const { Ticket } = require("../../../../models/Ticket");
const _ = require("lodash")
const { Trip } = require("../../../../models/Trip")
const { Seat } = require("../../../../models/Seat")
const {sendBookTicketEmail} = require ("../../../../services/email/bookTicket");
const createTicket = (req, res, next) => {
  const { tripId, seatCodes } = req.body;
  const { _id: userId } = req.user; // = const _userId = req.user._id
  Trip.findById(tripId)
    .populate("fromStationId")
    .populate("toStationId")
    .then(trip => {
      if (!trip) {
        return Promise.reject({
          status: 404,
          message: "trip not found"
        })
      }
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
      }
      const newTicket = new Ticket({
        userId, tripId,
        seats: seatCodes.map(code => new Seat({ code })),
        totalPrice: trip.price * seatCodes.length
      });
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
      sendBookTicketEmail(ticket, trip, req.user)
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