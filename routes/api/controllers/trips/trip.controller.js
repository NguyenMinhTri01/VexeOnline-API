const { Trip } = require('../../../../models/Trip');
const { Seat } = require('../../../../models/Seat');
const _ = require('lodash');

const seatCodes = [
  "A01", "A02", "A03", "A04", "A05", "A06", "A07", "A08", "A09", "A010", "A011", "A012",
  "B01", "B02", "B03", "B04", "B05", "B06", "B07", "B08", "B09", "B010", "B011", "B012",
  "C01", "C02", "C03", "C04", "C05", "C06", "C07", "C08", "C09", "C010", "C011", "C012",
]

const getTrips = (req, res, next) => {
  Trip.find()
    .then(trips => {
      const _trips = trips.map(trip => {
        // const modifiedTrip =  {
        //   ...trip._doc,
        //   availableSeatNumber: trip.seats.filter(seats => !seats.isBookmarked).length
        // };
        // delete modifiedTrip['seats'];
        // return modifiedTrip;


        // return {
        //   ..._.omit(trip._doc, ['seats']),
        //   availableSeatNumber: trip.seats.filter(seats => !seats.isBookmarked).length
        // }
        // return _.assign(
        //   _.omit(trip._doc, ['seats']),
        //   { availableSeatNumber: trip.seats.filter(seats => !seats.isBookmarked).length }
        // )

       return _.chain(trip)
       .get('_doc')
       .omit(['seats'])
       .assign({ availableSeatNumber: trip.seats.filter(seats => !seats.isBooked).length })
       .value()
      })
      res.status(200).json(_trips);
    })
    .catch(err => res.status(500).json(err))
};

const postTrips = (req, res, next) => {
  const { fromStationId, toStationId, startTime, price } = req.body;
  const seats = seatCodes.map(code => {
    return new Seat({ code })
  })
  const newTrip = new Trip({
    fromStationId, toStationId, startTime, price, seats
  })

  newTrip.save()
    .then(trip => res.status(200).json(trip))
    .catch(err => res.status(500).json(err));
};

const getTripById = (req, res, next) => {
  // hiển thi số lượng ghế trống
  
  Trip.findById(req.params.id)
    // .select("-seats")
    .then(trip => {
      if (!trip) return res.status(404).json({
        message: 'trip not found'
      })
      const modifiedTrip = {
        ..._.omit(trip._doc, ['seats']),
        availableSeatNumber: trip.seats.filter(seat => !seat.isBooked).length
      }
      return Promise.resolve(modifiedTrip)
    })
    .then((modifiedTrip) => {
      res.status(200).json(modifiedTrip)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json("loi o day")});
};

const patchTripById = (req, res, next) => {
  Trip.updateOne({ _id: req.params.id}, req.body)
  .then(trip => res.status(200).json(trip))
  .catch(err => res.status(500).json(err))
};

const deleteTripById = (req, res, next) => {
  Trip.deleteOne({ _id: req.params.id}, req.body)
  .then(trip => res.status(200).json(trip))
  .catch(err => res.status(500).json(err))
}



module.exports = {
  getTrips,
  postTrips,
  getTripById,
  patchTripById, 
  deleteTripById
}