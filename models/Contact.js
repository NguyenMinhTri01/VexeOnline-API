
const mongoose = require('mongoose')

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

const Contact = mongoose.model("Contact", ContactSchema, "Contact");

module.exports = {
  ContactSchema,
  Contact
}