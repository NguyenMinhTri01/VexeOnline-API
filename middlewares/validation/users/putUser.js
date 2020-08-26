const validator = require('validator');
const _ = require('lodash');
const { User } = require('../../../models/User')


const validatePutUser = async (req, res, next) => {
  let errors = {}
  const email = _.get(req, 'body.email', "");
  const password = _.get(req, 'body.password', "");
  const passwordConfirm = _.get(req, 'body.passwordConfirm', "");
  const fullName = _.get(req, 'body.fullName', "");
  const phone = _.get(req, 'body.phone', "");
  const userType = _.get(req, 'body.userType', 'client');

  // validate email
  // email empty ?
  if (validator.isEmpty(email)) {
    errors.email = 'email is require !'
  } else if (!validator.isEmail(email)) {   //email valid?
    errors.email = 'email is valid !'
  } else {
    const user = await User.findOne({ email });
    if (user) errors.email = 'email exist !'
  }
  // validate password

  if (validator.isEmpty(password)) {
    errors.password = 'password is require !'
  } else if (!validator.isLength(password, { min: 6 })) {
    errors.password = 'password must have at least 6 characters!'
  }

  // validate confirm password

  if (validator.isEmpty(passwordConfirm)){
    errors.passwordConfirm = 'passwordConfirm is require !'
  } else if (!validator.equals(password, passwordConfirm)) {
    errors.passwordConfirm = 'passwordConfirm not match !'
  }

  // validator fullName

  if (validator.isEmpty(fullName)){
    errors.fullName = 'fullName is require !'
  } else if (!validator.isLength(fullName, { min : 3})) {
    errors.fullName = "fullName must have at least 3 characters"
  }
// validator phone
if (validator.isEmpty(phone)){
    errors.phone = 'phone is require !'
  }
  if (_.isEmpty(errors)) return next();
  res.status(400).json(errors);
  //email exists?
  



}

module.exports = {
    validatePutUser
}