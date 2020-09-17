const { Ticket } = require("../../../../models/Ticket");
const _ = require("lodash")
const { Trip } = require("../../../../models/Trip")
const { Seat } = require("../../../../models/Seat")
const { sendBookTicketEmail } = require("../../../../services/email/bookTicket");
const createTicketCode = require('../../../../middlewares/generateTicketCode').createTicketCode

const createTicket = (req, res, next) => {
  const { customerName, email, phone, note, tripId, seatCodes } = req.body
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
      (trip.statusNumber == 0) ? trip.statusNumber = 1 : null;
      newTicket = new Ticket({
        ...newTicket,
        seats: seatCodes.map(code => new Seat({ code })),
        totalPrice: (trip.price * seatCodes.length),
        code: createTicketCode()
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
      // send mail
      res.status(200).json(ticket)
    })
    .catch(err => {
      if (err.status) {
        return res.status(err.status).json({ message: err.message })
      }
      console.log(err)
      return res.status(500).json({ err: "server error" });
    })
};

const getTickets = (req, res, next) => {
  Ticket.find()
    .then(tickets => {
      res.status(200).json(tickets)
    })
}

const getTicketById = (req, res, next) => {
  ///dasdsadas
};

const getTicketByCode = (req, res, next) => {
  const { code, phone } = req.params
  Ticket.findOne({ code, phone })
    .populate({
      path: 'tripId',
      populate: {
        path: 'garageId routeId vehicleId',
        populate: {
          path: 'fromStationId toStationId',
          select: "name "
        },
        select: "name price"
      },
      select: 'garageId routeId vehicleId price startTime endTime'
    })
    .then(ticket => {
      if (!ticket) return res.status(200).json({ err: true })
      const modifiedTicket = _.chain(ticket)
        .get('_doc')
        .omit(['seats'])
        .assign({
          numberOfSeat : ticket.seats.length,
          listSeat : ticket.seats.map(seat => seat.code).toString()
        })
        .value()
      return res.status(200).json(modifiedTicket)
    })
};

const cancelTicket = (req, res, next) => {
  const {id} = req.params
  let result = null
  Ticket.findById(id)
  .populate({
    path: 'tripId',
    populate: {
      path: 'garageId routeId vehicleId',
      populate: {
        path: 'fromStationId toStationId',
        select: "name "
      },
      select: "name price"
    },
    //select: 'garageId routeId vehicleId price startTime endTime'
  })
  .then(async ticket => {
    if (!ticket) return res.status(200).json({ err: true })
    result = {...ticket}
    ticket.statusTicket = 2;
    let trip = await Trip.findById(ticket.tripId);
    const listCanceledSeats = ticket.seats.map(seat => seat.code);
    trip.seats.forEach((seat, index) => {
      if (listCanceledSeats.indexOf(seat.code) != -1) {
        trip.seats[index].isBooked = false
      }
    })
    return Promise.all([
      ticket.save(),
      trip.save()
    ])
  })
  .then(([ticket, trip])=> {
    if (ticket) {
      result = _.chain(result)
      .get('_doc')
      .omit(['seats', 'statusTicket'])
      .assign({
        statusTicket : 2,
        numberOfSeat : ticket.seats.length,
        listSeat : ticket.seats.map(seat => seat.code).toString()
      })
      .value()
      return res.status(200).json(result)
    }
  })
}

const getBookingHistory = (req, res, next) => {
  if (req.user != 'guest' && req.user._id) {
    const userId = req.user._id;
    Ticket.find({ userId })
      .then(tickets => {
        res.status(200).json(tickets)
      })
      .catch(err => {
        console.log(err)
      })
  } else {
    res.status(404).json({ message: "does not exist booking history" })
  }
}

module.exports = {
  createTicket,
  getTickets,
  getTicketById,
  getTicketByCode,
  getBookingHistory,
  cancelTicket
}