const mongoose = require('mongoose');
const urlSlug = require('url-slug');

const BlogSchema = new mongoose.Schema({
  name: { type : String, required : true},
  slug : {type : String},
  hot : {type: Boolean, default : false},
  status : {type: Boolean, default : true},
  description : {type : String, required : true},
  content : {type : String, required : true},
  titleSeo : {type : String, required : true},
  descriptionSeo : {type : String, required : true},
  keywordSeo : {type : String, required : true},
  createdAt : {type : Date, default : Date.now},
  updatedAt : {type : Date}
})
BlogSchema.pre('save', function beforeSave(next) {
  const blog = this;
  if (!blog.isModified("name")) return next();
  blog.slug = urlSlug(blog.name);
  next();
});

const Blog = mongoose.model('Blog', BlogSchema, "Blog");
module.exports = {
  BlogSchema,
  Blog
}