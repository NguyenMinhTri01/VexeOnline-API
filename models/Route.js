const mongoose = require('mongoose');
const urlSlug = require('url-slug');

const RouteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: String,
  fromStationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Station'
  },
  toStationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Station'
  },
  policy: { type: String, default: '' },
  status: { type: Boolean, default: true },
  titleSeo: { type: String, required: true },
  descriptionSeo: { type: String, required: true },
  keywordSeo: { type: String, required: true },
  startTime: { type: Date, require: true },
  endTime: { type: Date, require: true, },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

RouteSchema.pre('save', function beforeSave(next) {
  const route = this;
  if (!route.isModified("name")) return next();
  route.slug = urlSlug(route.name);
  next();
});

const Route = mongoose.model('Route', RouteSchema, "Route");
module.exports = {
  Route,
  RouteSchema
}