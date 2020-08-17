const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
  routeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Route'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  numberStar: { type: Number, default: 0 },
  content: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date
});


const Rating = mongoose.model("Rating", RatingSchema, "Rating")

module.exports = {
  RatingSchema,
  Rating
}