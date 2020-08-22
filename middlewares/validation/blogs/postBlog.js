const validator = require('validator');
const _ = require('lodash');
const {Blog} = require("../../../models/Blog")



module.exports.validatePostBlog = async (req, res, next) => {
  let errors = {};
  const name = _.get(req, 'body.name', '');
  const description = _.get(req, 'body.description', '');
  const content = _.get(req, 'body.content', '');
  const titleSeo = _.get(req, 'body.titleSeo', '');
  const descriptionSeo = _.get(req, 'body.descriptionSeo', '');
  const keywordSeo = _.get(req, 'body.keywordSeo', '');
  // validate name 
  if (validator.isEmpty(name)) {
    errors.name = 'name blog is require !';
  } else if (!validator.isLength(name, { min: 3, max: 255 })) {
    errors.name = 'name blog must in clauses 3 and 255 characters !'
  } else{
    const blog = await Blog.findOne({name})
    if(blog) errors.name = "name exists"
  }

  // validate description
  if (validator.isEmpty(description)) {
    errors.description = 'description blog is require !';
  } else if (!validator.isLength(description, { min: 3, max: 500 })) {
    errors.description = 'description blog must in clauses 3 and 500 characters !'
  };

  // validate content 
  if (validator.isEmpty(content)) {
    errors.content = 'content blog is require !';
  } else if (!validator.isLength(content, { min: 3, max: 255 })) {
    errors.content = 'content blog must in clauses 3 and 255 characters !'
  };

  // validate titleSeo
  if (validator.isEmpty(titleSeo)) {
    errors.titleSeo = 'titleSeo blog is require !';
  } else if (!validator.isLength(titleSeo, { min: 3, max: 65 })) {
    errors.titleSeo = 'titleSeo blog must in clauses 3 and 65 characters !'
  } else if (validator.matches(titleSeo, /^(?=.*[!@#(){}+\$%\^&\*\'\"\/\\])/)) {
    errors.titleSeo = 'The titleSeo cannot contain "!@#(){}+\$%\^&\*\'\"\/\\"'
  };


  // validate descriptionSeo 
  if (validator.isEmpty(descriptionSeo)) {
    errors.descriptionSeo = 'descriptionSeo blog is require !';
  } else if (!validator.isLength(descriptionSeo, { min: 3, max: 255 })) {
    errors.descriptionSeo = 'descriptionSeo blog must in clauses 3 and 255 characters !'
  } else if (validator.matches(descriptionSeo, /^(?=.*[!@#(){}+\$%\^&\*\'\"\/\\])/)) {
    errors.descriptionSeo = 'The descriptionSeo cannot contain " !@#(){}+\$%\^&\*\'\"\/\\"'
  };


  // validate keywordSeo 
  if (validator.isEmpty(keywordSeo)) {
    errors.keywordSeo = 'keywordSeo blog is require !';
  } else if (!validator.isLength(keywordSeo, { min: 3, max: 255 })) {
    errors.keywordSeo = 'keywordSeo blog must in clauses 3 and 255 characters !'
  } else if (validator.matches(keywordSeo, /^(?=.*[!@#(){}+\$%\^&\*\'\"\/\\])/)) {
    errors.keywordSeo = 'The keywordSeo cannot contain !@#(){}+$%^&*\'\"/ '
  };




  if (_.isEmpty(errors)) return next();
  return res.status(400).json(errors);
};