const validator = require('validator');
const _ = require('lodash');



module.exports.validatePostStation = (req, res, next) => {
  let errors = {}
  const name = _.get(req, 'body.name', '');
  const address = _.get(req, 'body.address', '');
  const province = _.get(req, 'body.province', '');
  const titleSeo = _.get(req, 'body.titleSeo', '');
  const descriptionSeo = _.get(req, 'body.descriptionSeo', '');
  const keywordSeo = _.get(req, 'body.keywordSeo', '');
  // validate name 
  if (validator.isEmpty(name)) {
    errors.name = 'name station is require !';
  } else if (!validator.isLength(name, { min: 3, max: 255 })) {
    errors.name = 'name station must in clauses 3 and 255 characters !'
  };

  // validate address
  if (validator.isEmpty(address)) {
    errors.address = 'address station is require !';
  } else if (!validator.isLength(address, { min: 3, max: 500 })) {
    errors.address = 'address station must in clauses 3 and 500 characters !'
  };

  // validate province 
  if (validator.isEmpty(province)) {
    errors.province = 'province station is require !';
  } else if (!validator.isLength(province, { min: 3, max: 255 })) {
    errors.province = 'province station must in clauses 3 and 255 characters !'
  };

  // validate titleSeo
  if (validator.isEmpty(titleSeo)) {
    errors.titleSeo = 'titleSeo station is require !';
  } else if (!validator.isLength(titleSeo, { min: 3, max: 65 })) {
    errors.titleSeo = 'titleSeo station must in clauses 3 and 65 characters !'
  } else if (validator.matches(titleSeo, /^(?=.*[!@#(){}+\$%\^&\*\'\"\/\\])/)) {
    errors.titleSeo = 'The titleSeo cannot contain "!@#(){}+\$%\^&\*\'\"\/\\"'
  };


  // validate descriptionSeo 
  if (validator.isEmpty(descriptionSeo)) {
    errors.descriptionSeo = 'descriptionSeo station is require !';
  } else if (!validator.isLength(descriptionSeo, { min: 3, max: 255 })) {
    errors.descriptionSeo = 'descriptionSeo station must in clauses 3 and 255 characters !'
  } else if (validator.matches(descriptionSeo, /^(?=.*[!@#(){}+\$%\^&\*\'\"\/\\])/)) {
    errors.descriptionSeo = 'The descriptionSeo cannot contain " !@#(){}+\$%\^&\*\'\"\/\\"'
  };


  // validate keywordSeo 
  if (validator.isEmpty(keywordSeo)) {
    errors.keywordSeo = 'keywordSeo station is require !';
  } else if (!validator.isLength(keywordSeo, { min: 3, max: 255 })) {
    errors.keywordSeo = 'keywordSeo station must in clauses 3 and 255 characters !'
  } else if (validator.matches(keywordSeo, /^(?=.*[!@#(){}+\$%\^&\*\'\"\/\\])/)) {
    errors.keywordSeo = 'The keywordSeo cannot contain !@#(){}+$%^&*\'\"/ '
  };




  if (_.isEmpty(errors)) return next();
  res.status(400).json(errors);
};