const validator = require('validator');
const _ = require('lodash');
const {PageStatic} = require("../../../models/PageStatic")


module.exports.validatePostPageStatic = async (req, res, next) => {
    let errors = {};
    const name = _.get(req, 'body.name', '');
    const content = _.get(req, 'body.content', '');

    // validate name 
    if (validator.isEmpty(name)) {
      errors.name = 'name page static is require !';
    } else if (!validator.isLength(name, { min: 3, max: 255 })) {
      errors.name = 'name page static must in clauses 3 and 255 characters !'
    } else{
      const pageStatic = await PageStatic.findOne({name})
      if(pageStatic) errors.name = "Tên trang tĩnh tồn tại"
    }

    // validate content 
    if (validator.isEmpty(content)) {
      errors.content = 'content page static is require !';
    } else if (!validator.isLength(content, { min: 3, max: 255 })) {
      errors.content = 'content page static must in clauses 3 and 255 characters !'
    };

  
    if (_.isEmpty(errors)) return next();
    return res.status(400).json(errors);
  };