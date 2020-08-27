const validator = require('validator');
const _ = require('lodash');



module.exports.validatePutTrip = async (req, res, next) => {
  let errors = {};
  const garageId = _.get(req, 'body.garageId', '');
  const routeId = _.get(req, 'body.routeId', '');
  const vehicleId = _.get(req, 'body.vehicleId', '');
  const startTime = _.get(req, 'body.startTime', '');
  const price = _.get(req, 'body.price', '');
  const note = _.get(req, 'body.note', '');
  const tripId = _.get(req, 'params.id', '');

  // validate tripId
  if (validator.isEmpty(tripId)) {
    errors.tripId = 'tripId is require !';
  } else if (!validator.isMongoId(tripId)) {
    errors.tripId = 'tripId invalid!'
  };
  // validate garageId 
  if (validator.isEmpty(garageId)) {
    errors.garageId = 'garageId is require !';
  } else if (!validator.isMongoId(garageId)) {
    errors.garageId = 'garageId invalid!'
  };
  // validate routeId 
  if (validator.isEmpty(routeId)) {
    errors.routeId = 'routeId is require !';
  } else if (!validator.isMongoId(routeId)) {
    errors.routeId = 'routeId invalid !'
  };
  // validate vehicleId
  if (validator.isEmpty(vehicleId)) {
    errors.vehicleId = 'vehicleId is require !';
  } else if (!validator.isMongoId(vehicleId)) {
    errors.vehicleId = 'vehicleId invalid !'
  };

/**
 * @param {*} startTime must be string format date 
 * new Date(2020, 08, 27) => '2020-09-26T17:00:00.000Z'
 */

  // validate startTime 
  if (validator.isEmpty(startTime)) {
    errors.startTime = 'startTime is require !';
  } else if (!validator.isISO8601(startTime)) {
    errors.startTime = 'startTime invalid'
  }; 


  // validate price 
  if (validator.isEmpty(`${price}`)) {
    errors.price = 'price is require !';
  } else if (!validator.isNumeric(`${price}`)) {
    errors.price = 'price invalid'
  };

 // validate note 
  if (!validator.isLength(note, {max : 1000})){
    errors.note = 'Only a maximum of 1000 characters is allowed'
  }


  if (_.isEmpty(errors)) return next();
  return res.status(400).json(errors);
};