const { Trip } = require('../../../../models/Trip');
const { Seat } = require('../../../../models/Seat');
const { Vehicle } = require('../../../../models/Vehicle');
const { Route } = require('../../../../models/Route');
const { Garage } = require("../../../../models/Garage")
const _ = require('lodash');
const seatCodes = require('../../../../data/seatCodes.json');
const router = require('../tickets');

const getTrips = (req, res, next) => {
  Trip.find()
    .populate({
      path: "garageId",
      select: 'name -_id'
    })
    .populate({
      path: "routeId",
      select: 'name -_id'
    })
    .populate({
      path: "vehicleId",
      select: 'name -_id'
    })
    .then(trips => {
      const _trips = trips.map(trip => {
        const timeNow = Date.now()
        const startTime = new Date(trip.startTime)
        if (timeNow > startTime.getTime() && trip.statusNumber < 2) {
          trip.statusNumber = 2
          trip.save();
        }
        return _.chain(trip)
          .get('_doc')
          .omit(['seats', 'garageId', 'routeId', 'vehicleId'])
          .assign({
            availableSeatNumber: trip.seats.filter(seats => !seats.isBooked).length,
            garageName: trip.garageId.name,
            routeName: trip.routeId.name,
            vehicleName: trip.vehicleId.name,
            denyEdit: (trip.statusNumber != 0), // 1 2 3 => true
            denyDelete: (trip.statusNumber === 1 || trip.statusNumber === 2), // 1 2 => true
          })
          .value()
      })
      res.status(200).json(_trips);
    })
    .catch(err => {
      console.log(err)
      res.status(500).json(err)
    })
};

const getCountTrips = (req, res, next) => {
  Trip.find()
  .countDocuments()
    .then(trips => {
      res.status(200).json(trips);
    })
    .catch(err => {
      res.status(500).json(err)
    })
};
const postTrip = (req, res, next) => {
  let seats = [];
  let startTime = new Date(req.body.startTime);
  let trip = null
  Garage.findById(req.body.garageId)
    .then(garage => {
      if (!garage) return res.status(404).json({
        message: 'garage is not found'
      })
    });
  Route.findById(req.body.routeId)
    .then(route => {
      if (!route) return res.status(404).json({
        message: 'route is not found'
      })
    });
  Vehicle.findById(req.body.vehicleId)
    .then(vehicle => {
      if (!vehicle) return new Promise.reject({
        status: 404,
        message: "vehicle is not found"
      })
      for (let i = 0; i < vehicle.numberOfSeats; i++) {
        seats.push(new Seat({ code: seatCodes[i] }))
      }
      trip = {
        ...req.body,
        seats
      }
      return Route.findById(req.body.routeId)
    })
    .then(route => {
      if (!route) return new Promise.reject({
        status: 404,
        message: "route not found"
      })
      const time = route.time
      const endTime = new Date(startTime.getTime() + (time * 60 * 60 * 1000))
      trip = {
        ...trip,
        endTime
      }
      const newTrip = new Trip(trip)
      return newTrip.save()
    })
    .then(_trip => {
      res.status(200).json(_trip)
    })
    .catch(err => res.status(err.status).json(err.message))
};

const getTripById = (req, res, next) => {
  Trip.findById(req.params.id)
    .populate({
      path: "garageId",
      select: 'name avatar'
    })
    .populate({
      path: "routeId",
      populate: {
        path: "fromStationId toStationId",
        select: "name province -_id"
      },
      select: '-createdAt -updatedAt -hot -status'
    })
    .populate({
      path: "vehicleId",
      select: '-createdAt -updatedAt -status'
    })
    .then(trip => {
      if (!trip) return res.status(404).json({
        message: 'trip not found'
      })
      const modifiedTrip = {
        ..._.omit(trip._doc),
        availableSeatNumber: trip.seats.filter(seat => !seat.isBooked).length,
      }
      return Promise.resolve(modifiedTrip)
    })
    .then((modifiedTrip) => {
      res.status(200).json(modifiedTrip)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json(err)
    });
};

const putTrip = (req, res, next) => {
  const { id } = req.params
  Trip.findById(id)
    .then(async trip => {
      if (!trip) return res.status(404).json({
        message: 'trip not found'
      })
      if (trip.statusNumber != 0) return res.status(404).json({
        message: 'trip is not edit'
      })
      if (trip.garageId != req.body.garageId) {
        const garage = await Garage.findById(req.body.garageId)
        if (!garage) return res.status(404).json({
          message: 'garage is fonud'
        })
      }
      if (trip.vehicleId != req.body.vehicleId) {
        const vehicle = await Vehicle.findById(req.body.vehicleId)
        if (!vehicle) return res.status(404).json({
          message: 'vehicle is fonud'
        })
        trip.vehicleId = req.body.vehicleId
        let seats = []
        for (let i = 0; i < vehicle.numberOfSeats; i++) {
          seats.push(new Seat({ code: seatCodes[i] }))
        }
        trip.seats = seats
      };
      if (trip.startTime != req.body.startTime || trip.routeId != req.body.routeId) {
        const route = await Route.findById(req.body.routeId)
        if (!route) return res.status(404).json({
          message: 'route is fonud'
        })
        trip.routeId = req.body.routeId
        let startTime = new Date(req.body.startTime)
        let endTime = new Date(startTime.getTime() + (route.time * 60 * 60 * 1000))
        trip.startTime = startTime;
        trip.endTime = endTime;
      };
      trip.price = req.body.price;
      trip.note = req.body.note;
      return trip.save()
    })
    .then(trip => res.status(200).json(_.omit(trip._doc, ['seats'])))
};

const deleteTripById = (req, res, next) => {
  const { id } = req.params
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    Trip.findById(id)
      .then(trip => {
        if (!trip) return res.status(404).json({ message: "trip not found" })
        if (trip.statusNumber === 1 || trip.statusNumber === 2) return res.status(404).json({ message: "trip can not delete" })
        return Trip.deleteOne({ _id: id })
      })
      .then(result => res.status(200).json(result))
      .catch(err => res.status(500).json(err))
  } else return res.status(404).json({ message: "trip id invalid" })
};

const updateTripStatusNumber = (req, res, next) => {
  const { id } = req.params
  let garageName = "";
  let routeName = "";
  let vehicleName = "";
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    Trip.findById(id)
      .populate({
        path: "garageId",
        select: 'name -_id'
      })
      .populate({
        path: "routeId",
        select: 'name -_id'
      })
      .populate({
        path: "vehicleId",
        select: 'name -_id'
      })
      .then(trip => {
        garageName = trip.garageId.name
        routeName = trip.routeId.name
        vehicleName = trip.vehicleId.name
        if (!trip) return res.status(404).json({ message: "trip not found" })
        if (trip.statusNumber != 2) return res.status(404).json({ message: "trip can not update status number" })
        trip.statusNumber = 3
        return trip.save()
      })
      .then(trip => {
        const _trip = _.chain(trip)
          .get('_doc')
          .omit(['seats', 'garageId', 'routeId', 'vehicleId'])
          .assign({
            availableSeatNumber: trip.seats.filter(seats => !seats.isBooked).length,
            garageName,
            routeName,
            vehicleName,
            denyEdit: (trip.statusNumber != 0), // 1 2 3 => true
            denyDelete: (trip.statusNumber === 1 || trip.statusNumber === 2), // 1 2 => true
          })
          .value()
        res.status(200).json(_trip)
      })
  } else return res.status(404).json({ message: "trip id invalid" })
};

const searchTrips = (req, res, next) => {
  const { formStation, toStation, date } = req.body;
  const dateSearch = new Date(date);
  const dayOfMonth = dateSearch.getDate();
  const month = dateSearch.getMonth();
  const year = dateSearch.getFullYear();
  Route.find()
    .populate({
      path: "fromStationId",
      select: 'province -_id'
    })
    .populate({
      path: "toStationId",
      select: 'province -_id'
    })
    .select('name fromStationId toStationId')
    .then(routes => {
      if (routes.length > 0) {
        let arrRouteIdNeed = routes.filter(item => (
          item.fromStationId.province === formStation &&
          item.toStationId.province === toStation));
        arrRouteIdNeed = arrRouteIdNeed.map(item => item._id);
        return Trip.find({
          $and: [
            { routeId: { $in: arrRouteIdNeed } },
            { statusNumber: { $lt: 2 } },
            { startTime: { $gt: new Date(Date.now()) } },
            { startTime: { $gte: new Date(year, month, dayOfMonth), $lt: new Date(year, month, dayOfMonth + 1) } }
          ]
        })
          .populate({
            path: "garageId",
            select: 'name avatar'
          })
          .populate({
            path: "routeId",
            populate: {
              path: "fromStationId toStationId",
              select: "name province -_id"
            },
            select: '-createdAt -updatedAt -hot -status'
          })
          .populate({
            path: "vehicleId",
            select: '-createdAt -updatedAt -status'
          })
      }
    })
    .then(trips => {
      trips = trips.map(trip => {
        return _.chain(trip)
          .get('_doc')
          .omit(['seats'])
          .assign({ availableSeatNumber: trip.seats.filter(seats => !seats.isBooked).length })
          .value()
      })
      res.status(200).json(trips)
    })

};

const getTripByFromStation = (req, res, next) => {
  const { slug } = req.params;
  const timeNow = new Date(Date.now())
  Route.find()
    .populate({
      path: "fromStationId",
      select: 'slug -_id'
    })
    .select('name fromStationId')
    .then(routes => {
      if (routes.length > 0) {
        let arrRouteIdNeed = routes.filter(item => (
          item.fromStationId.slug === slug));
        arrRouteIdNeed = arrRouteIdNeed.map(item => item._id);
        return Trip.find({
          $and: [
            { routeId: { $in: arrRouteIdNeed } },
            { statusNumber: { $lt: 2 } },
            { startTime: { $gt: timeNow, $lt: new Date(timeNow.getFullYear(), timeNow.getMonth(), timeNow.getDate() + 1) } }
          ]
        })
          .populate({
            path: "garageId",
            select: 'name'
          })
          .populate({
            path: "routeId",
            select: '-createdAt -updatedAt -hot -status'
          })
      }
    })
    .then(trips => {
      trips = trips.map(trip => {
        return _.chain(trip)
          .get('_doc')
          .omit(['seats'])
          .assign({ availableSeatNumber: trip.seats.filter(seats => !seats.isBooked).length })
          .value()
      })
      res.status(200).json(trips)
    })
}



module.exports = {
  getTrips,
  postTrip,
  getTripById,
  deleteTripById,
  putTrip,
  updateTripStatusNumber,
  searchTrips,
  getTripByFromStation,
  getCountTrips
}