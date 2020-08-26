const validator = require('validator');
const _ = require('lodash');


module.exports.validatePutVehicle = (req, res, next) => {
  let errors = {}
  const name = _.get(req, 'body.name', '');
  const numberOfSeats = _.get(req, 'body.numberOfSeats', '');
  const utilities = _.get(req, 'body.utilities', '');


  // validate name 
  if (validator.isEmpty(name)) {
    errors.name = 'name vehicle is require !';
  } else if (!validator.isLength(name, { min: 3, max: 255 })) {
    errors.name = 'name vehicle must be in clauses 3 and 255 characters !'
  };
  

  if (validator.isEmpty(`${numberOfSeats}`)) {
    errors.numberOfSeats = 'number of seats is require !';
  } else if (!validator.isNumeric(`${numberOfSeats}`)) {
    errors.numberOfSeats = 'the number of seats must be the number!';
  } else if (validator.toInt(`${numberOfSeats}`) < 4 || validator.toInt(`${numberOfSeats}`) > 60) {
    errors.numberOfSeats = 'the number of seats must be in clauses 4 and 60 seat!';
  };

  if (!validator.isEmpty(utilities) && !validator.isLength(utilities, { min: 3, max: 1000 })) {
    errors.utilities = 'name vehicle must be in clauses 3 and 1000 characters !'
  };

  if (_.isEmpty(errors)) return next();
  res.status(400).json(errors);
}