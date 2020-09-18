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
        totalPrice: (trip.price * seatCodes.length ),
        code : createTicketCode()
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
      return res.status(500).json({err : "server error"});
    })
};

const getTickets = (req, res, next) => {
  Ticket.find()
  .populate({
    path: "tripId",
    select: 'garageId routeId vehicleId price -_id',
    populate:{
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
const getstatusTicketById = (req,res,next) => {
  const {id} = req.params;
  Ticket.findById(id)
  .then(ticket=>{
      if(!ticket) return Promise.reject({
          status: 404,
          message: "Ticket not found"
      })
      if(ticket["statusTicket"]===0){
        ticket["statusTicket"] = 1
      }else if(ticket["statusTicket"]===1){
        ticket["statusTicket"] = 2
      }
      
      return ticket.save();
  })
  .then(ticket=>res.status(200).json(ticket))
  .catch(err=>res.status(500).json(err))


}
const getTicketById = (req, res, next) => {

};

const getTicketByCode = (req, res, next) => {
  const {code} = req.params
  Ticket.findOne({code})
  .then(ticket => {
    ticket ? res.status(200).json(ticket) : res.status(200).json(null)
  })
};

const getBookingHistory = (req, res, next) => {
  if (req.user != 'guest' && req.user._id) {
    const userId = req.user._id;
    Ticket.find({userId})
    .then(tickets => {
      res.status(200).json(tickets)
    })
    .catch(err => {
      console.log(err)
    })
  } else {
    res.status(404).json({message : "does not exist booking history"})
  }
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

module.exports = {
  createTicket,
  getTickets,
  getTicketById,
  getTicketByCode,
  getBookingHistory,
  getstatusTicketById,
  deleteTicketById
}