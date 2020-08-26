const validator = require('validator');
const _ = require('lodash');



module.exports.validatePutRoute = (req, res, next) => {
  let errors = {};
  const name = _.get(req, 'body.name', '');
  const fromStationId = _.get(req, 'body.fromStationId', '');
  const toStationId = _.get(req, 'body.toStationId', '');
  const policy = _.get(req, 'body.policy', '');
  const time = _.get(req, 'body.time', '');
  const titleSeo = _.get(req, 'body.titleSeo', '');
  const descriptionSeo = _.get(req, 'body.descriptionSeo', '');
  const keywordSeo = _.get(req, 'body.keywordSeo', '');

  // validate name 
  if (validator.isEmpty(name)) {
    errors.name = 'name is require !';
  } else if (!validator.isLength(name, { min: 3, max: 255 })) {
    errors.name = 'name must in clauses 3 and 255 characters !'
  };

  // validate fromStationId
  if (validator.isEmpty(fromStationId)) {
    errors.fromStationId = 'fromStation is require !';
  };

  // validate toStationId
  if (validator.isEmpty(toStationId)) {
    errors.toStationId = 'toStation is require !';
  };

  // validate policy 
  if (validator.isEmpty(policy)) {
    errors.policy = 'policy is require !';
  } else if (!validator.isLength(policy, { min: 3, max: 255 })) {
    errors.policy = 'policy must in clauses 3 and 255 characters !'
  };


  // validate time 
  // if (validator.isEmpty(time)) {
  //   errors.time = 'time is require !';
  // };

  // validate titleSeo
  if (validator.isEmpty(titleSeo)) {
    errors.titleSeo = 'titleSeo is require !';
  } else if (!validator.isLength(titleSeo, { min: 3, max: 65 })) {
    errors.titleSeo = 'titleSeo must in clauses 3 and 65 characters !'
  } else if (validator.matches(titleSeo, /^(?=.*[!@#(){}+\$%\^&\*\'\"\/\\])/)) {
    errors.titleSeo = 'The titleSeo cannot contain "!@#(){}+\$%\^&\*\'\"\/\\"'
  };


  // validate descriptionSeo 
  if (validator.isEmpty(descriptionSeo)) {
    errors.descriptionSeo = 'descriptionSeo is require !';
  } else if (!validator.isLength(descriptionSeo, { min: 3, max: 255 })) {
    errors.descriptionSeo = 'descriptionSeo must in clauses 3 and 255 characters !'
  } else if (validator.matches(descriptionSeo, /^(?=.*[!@#(){}+\$%\^&\*\'\"\/\\])/)) {
    errors.descriptionSeo = 'The descriptionSeo cannot contain " !@#(){}+\$%\^&\*\'\"\/\\"'
  };


  // validate keywordSeo 
  if (validator.isEmpty(keywordSeo)) {
    errors.keywordSeo = 'keywordSeo is require !';
  } else if (!validator.isLength(keywordSeo, { min: 3, max: 255 })) {
    errors.keywordSeo = 'keywordSeo must in clauses 3 and 255 characters !'
  } else if (validator.matches(keywordSeo, /^(?=.*[!@#(){}+\$%\^&\*\'\"\/\\])/)) {
    errors.keywordSeo = 'The keywordSeo cannot contain !@#(){}+$%^&*\'\"/ '
  };




  if (_.isEmpty(errors)) return next();
  return res.status(400).json(errors);
};