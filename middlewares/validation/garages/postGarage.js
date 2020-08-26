const validator = require('validator');
const _ = require('lodash');
const {Garage} = require("../../../models/Garage")



module.exports.validatePostGarage = async (req, res, next) => {
  let errors = {}
  const name = _.get(req, 'body.name', '');
  const address = _.get(req, 'body.address', '');
  const content = _.get(req, 'body.content', '');

  // validate name 
  if (validator.isEmpty(name)) {
    errors.name = 'name station is require !';
  } else if (!validator.isLength(name, { min: 3, max: 255 })) {
    errors.name = 'name station must in clauses 3 and 255 characters !'
  }else{
    const garage = await Garage.findOne({name})
    if(garage) errors.name = "Tên nhà xe tồn tại"
  };

  // validate address
  if (validator.isEmpty(address)) {
    errors.address = 'address station is require !';
  } else if (!validator.isLength(address, { min: 3, max: 500 })) {
    errors.address = 'address station must in clauses 3 and 500 characters !'
  };

  // validate content 
  if (validator.isEmpty(content)) {
    errors.content = 'content station is require !';
  };

  if (_.isEmpty(errors)) return next();
  res.status(400).json(errors);
};