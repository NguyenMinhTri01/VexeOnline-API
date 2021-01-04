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
        console.log('availableSeatCodes',availableSeatCodes);
        console.log('seatCodes',seatCodes);
        
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
    .then(async ([ticket, trip]) => {
      if (req.user != 'guest' && req.user._id) {
        
        // await sendBookTicketEmail(ticket._id, req.user)
        res.status(200).json(ticket) 
      }else{

        // await sendBookTicketEmail(ticket._id, {fullName:customerName,email:email})
        res.status(200).json(ticket)
      }
      
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
    .sort({ createdAt: -1 })
    .populate({
      path: "tripId",
      select: 'garageId routeId vehicleId price -_id',
      populate: {
        path: 'garageId routeId vehicleId',
        select: 'name'
      },
    })
    .then(tickets => {
      // tickets = tickets.map(ticket=>{
      //   return _.chain(ticket)
      //   .get('_doc')
      //   .omit(['tripId'])
      //   .assign({
      //     garageName: ticket.tripId.garageId.name,
      //     routeName: ticket.tripId.routeId.name,
      //     vehicleName: ticket.tripId.vehicleId.name,
      //   })
      //   .value()
      // })
      res.status(200).json(tickets)
    })
}
const getLatestTickets = (req, res, next) => {
  Ticket.find()
    .limit(10)
    .sort({ createdAt: -1 })
    .populate({
      path: "tripId",
      select: 'garageId routeId vehicleId price -_id',
      populate: {
        path: 'garageId routeId vehicleId',
        select: 'name'
      },
    })
    .then(tickets => {
      res.status(200).json(tickets)
    })
}
const getCountTickets = (req, res, next) => {
  Ticket.find()
    .countDocuments()
    .then(tickets => {
      res.status(200).json(tickets)
    })
    .catch(err => {
      res.status(500).json(err)
    })
}
const getstatusTicketById = (req, res, next) => {
  const { id } = req.params;
  Ticket.findById(id)
    .then(async ticket => {
      if (!ticket) return Promise.reject({
        status: 404,
        message: "Ticket not found"
      })
      if (ticket["statusTicket"] === 0) {
        ticket["statusTicket"] = 1
      } else if (ticket["statusTicket"] === 1) {

        let trip = await Trip.findById(ticket.tripId);
        if (trip.statusNumber < 2) {
          ticket["statusTicket"] = 2
          const listCanceledSeats = ticket.seats.map(seat => seat.code);
          trip.seats.forEach((seat, index) => {
            if (listCanceledSeats.indexOf(seat.code) != -1) {
              trip.seats[index].isBooked = false
            }
          })
          await trip.save();
        }
      }
      return ticket.save();
    })
    .then(ticket => res.status(200).json(ticket))
    .catch(err => res.status(500).json(err))
}
const getTicketById = (req, res, next) => {
  const { id } = req.params
  Ticket.findById(id)
    .sort({ createdAt: -1 })
    .populate({
      path: "tripId",
      select: 'garageId routeId vehicleId price startTime endTime -_id',
      populate: {
        path: 'garageId routeId vehicleId',
        select: 'name',
        populate: {
          path: 'fromStationId toStationId',
          select: "name "
        },
      },
    })
    .then(ticket => {
      if (!ticket) return res.status(200).json({ err: true })
      const modifiedTicket = _.chain(ticket)
        .get('_doc')
        .omit(['seats'])
        .assign({
          numberOfSeat: ticket.seats.length,
          listSeat: ticket.seats.map(seat => seat.code).toString()
        })
        .value()
      return res.status(200).json(modifiedTicket)
    })
    .catch(err => err.status(500).json(err))
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
          numberOfSeat: ticket.seats.length,
          listSeat: ticket.seats.map(seat => seat.code).toString()
        })
        .value()
      return res.status(200).json(modifiedTicket)
    })
};
const searchByCode = (req, res, next) => {
  const { code } = req.params
  Ticket.findOne({ code })
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
          numberOfSeat: ticket.seats.length,
          listSeat: ticket.seats.map(seat => seat.code).toString()
        })
        .value()
      return res.status(200).json([modifiedTicket])
    })
};
const cancelTicket = (req, res, next) => {
  const { id } = req.params
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
      result = { ...ticket }
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
    .then(([ticket, trip]) => {
      if (ticket) {
        result = _.chain(result)
          .get('_doc')
          .omit(['seats', 'statusTicket'])
          .assign({
            statusTicket: 2,
            numberOfSeat: ticket.seats.length,
            listSeat: ticket.seats.map(seat => seat.code).toString()
          })
          .value()
        return res.status(200).json(result)
      }
    })
}

const getBookingHistory = (req, res, next) => {
  // if (req.user.userType === 'client' && req.user._id) {
  const userId = req.user._id;
  Ticket.find({ userId })
    .sort({ createdAt: -1 })
    .populate({
      path: "tripId",
      select: 'garageId routeId vehicleId price -_id',
      populate: {
        path: 'garageId routeId vehicleId',
        select: 'name'
      },
    })
    .then(tickets => {
      if (tickets.length === 0) {
        return Promise.reject({
          status: 400,
          message: "Không tìm thấy vé nào"
        });
      } else {
        res.status(200).json(tickets)
      }

    })
    .catch(err => {
      if (err.status === 400) return res.status(err.status).json({ message: err.message })
      return res.json(err);
    })
  // } else {
  //   res.status(404).json({ message: "does not exist booking history" })
  // }
}

const deleteTicketById = (req, res, next) => {
  const { id } = req.params
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    Ticket.findById(id)
      .then(ticket => {
        if (!ticket) return res.status(404).json({ message: "ticket not found" })
        return Ticket.deleteOne({ _id: id })
      })
      .then(result => res.status(200).json(result))
      .catch(err => res.status(500).json(err))
  } else return res.status(404).json({ message: "ticket id invalid" })
};

const getPaginationTickets = (req, res, next) => {
  const page = parseInt(req.query.page);
  const page_size = 5;
  Ticket.find()
    .skip((page - 1) * page_size)
    .limit(page_size)
    .sort({ createdAt: -1 })
    .populate({
      path: "tripId",
      select: 'garageId routeId vehicleId price -_id',
      populate: {
        path: 'garageId routeId vehicleId',
        select: 'name'
      },
    })
    .then(tickets => {
      res.status(200).json(tickets)
    })
    .catch(err => {
      res.status(500).json(err)
    })
};

module.exports = {
  createTicket,
  getTickets,
  getTicketById,
  getTicketByCode,
  getBookingHistory,
  getstatusTicketById,
  deleteTicketById,
  cancelTicket,
  getCountTickets,
  getLatestTickets,
  searchByCode,
  getPaginationTickets
}