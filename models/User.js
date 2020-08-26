const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  email: {type: String, required: true},
  password: {type: String, required:true},
  fullName: {type: String, required: true},
  phone: {type: String, required: true},
  userType: {type: String, default: 'client'},
  avatar : {type: String, default: "VexeOnlineMedia/imageDefault/no-image_ljozla"},
  createdAt : {type : Date, default : Date.now},
  updatedAt : Date
})
UserSchema.pre('save', function beforeSave(next) {
  const user = this;
  if (!user.isModified("password")) return next();
  bcrypt.genSalt(10)
  .then(salt => bcrypt.hash(user.password, salt))
  .then (hash => {
    user.password = hash;
    next();
  })
});



const User = mongoose.model('User', UserSchema, 'User');
module.exports = {
  User,
  UserSchema
}