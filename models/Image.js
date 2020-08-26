const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  public_id : {type : String, required : true}
})
const Image = mongoose.model('Image', ImageSchema, 'Image');

module.exports = {
  Image,
  ImageSchema
}