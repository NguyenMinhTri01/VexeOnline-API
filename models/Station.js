const mongoose = require('mongoose');
const urlSlug = require('url-slug');

const StationSchema = new mongoose.Schema({
  name: { type : String, required : true},
  avatar : {type : String, default : "VexeOnlineMedia/imageDefault/no-image_ljozla"},
  slug : {type : String},
  address: { type : String, required: true},
  province: { type : String, required : true},
  hot : {type: Boolean, default : false},
  status : {type: Boolean, default : true},
  titleSeo : {type : String, required : true},
  descriptionSeo : {type : String, required : true},
  keywordSeo : {type : String, required : true},
  createdAt : {type : Date, default : Date.now},
  updatedAt : {type : Date}
})
StationSchema.pre('save', function beforeSave(next) {
  const station = this;
  if (!station.isModified("name")) return next();
  station.slug = urlSlug(station.name);
  next();
});

const Station = mongoose.model('Station', StationSchema, "Station");
module.exports = {
  StationSchema,
  Station
}