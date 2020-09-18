const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  email: {type: String, required: true},
  password: {type: String, required:true},
  fullName: {type: String, required: true},
  phone: {type: String},
  userType: {type: String, default: 'client', enum : ['client', 'admin']},
  avatar : {type: String, default: "VexeOnlineMedia/imageDefault/no-image_ljozla"},
  facebook : {
    id : String,
    accessToken : String
  },
  google : {
    id : String,
    accessToken : String
  },
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