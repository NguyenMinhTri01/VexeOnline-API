const mongoose = require ("mongoose");
const urlSlug = require('url-slug');


const PageStaticSchema = new mongoose.Schema({
  name : {type : String, required : true},
  content : {type : String, required : true},
  slug : String,
  createdAt : {type : Date, default : Date.now},
  updatedAt : {type : Date}
});


PageStaticSchema.pre('save', function beforeSave(next) {
  const pageStatic = this;
  if (!pageStatic.isModified("name")) return next();
  pageStatic.slug = urlSlug(pageStatic.name);
  next();
});

const PageStatic = mongoose.model('PageStatic', PageStaticSchema, "PageStatic");
module.exports = {
  PageStaticSchema,
  PageStatic
}