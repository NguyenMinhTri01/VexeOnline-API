const validator = require('validator');
const _ = require('lodash');



module.exports.validatePutStation = (req, res, next) => {
  let errors = {}
  const name = _.get(req, 'body.name', '');
  const address = _.get(req, 'body.address', '');
  const province = _.get(req, 'body.province', '');
  // validate name 
  if (validator.isEmpty(name)) {
    errors.name = 'name station is require !';
  }
  else if (!validator.isLength(name, {min : 3, max : 255})){
    errors.name = 'name station must in clauses 3 and 255 characters !'
  }

  // validate address


  if (validator.isEmpty(address)) {
    errors.address = 'address station is require !';
  }
  else if (!validator.isLength(address, {min : 3, max : 500})){
    errors.address = 'address station must in clauses 3 and 500 characters !'
  }

  // validate province 

  if (validator.isEmpty(province)) {
    errors.provice = 'province station is require !';
  }
  else if (!validator.isLength(province, {min : 3, max : 255})){
    errors.province = 'province station must in clauses 3 and 255 characters !'
  }
  if (_.isEmpty(errors)) return next();
  res.status(400).json(errors);
};