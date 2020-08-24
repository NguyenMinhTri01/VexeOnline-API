const {User}  = require('../../../../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');//built-in package
const _  = require('lodash');
const { uploadImageToCloudinary, removeImageFromCloudinary } = require ('../../../../middlewares/uploadImageToCloudinary');


// register users
const jwtSign = promisify(jwt.sign);
const postUsers = (req, res, next) => {
  const {email, password, fullName,userType} = req.body;
  let newUser = new User({email, password, fullName,userType});
  newUser.save()
  .then(user => res.status(200).json({message: user}))
  .catch(err => res.json(err))


};
const login = (req, res, next) => {
  const {email, password} = req.body;
  let _user;
  User.findOne({email})
  .then(user => {
    if (!user) return Promise.reject({status: 400,message: "Email not found"})
    _user = user;
    return bcrypt.compare(password, user.password)
  })
  .then(isMatched => {
    if (!isMatched) return Promise.reject({status: 400, message: "Wrong password"});
    const payload = _.pick(_user, ['email', '_id', 'fullName', 'userType']);
    return jwtSign (
      payload,
      'TriMinh',
      {expiresIn : 3600}
    )
  })
  .then(token => res.status(200).json({message: "Success", token}))
  .catch(err =>{
    if (err.status === 400) return res.status(err.status).json({message : err.message})
    return res.json(err);
  })
};

const uploadAvatar = (req, res, next) => {
  let user = null;
  const {email} = req.user
  User.findOne({email})
  .then((_user) => {
    if (!_user) return Promise.reject({
      status : 404,
      message : 'Email not exist'
    })
    user = _user;
    return uploadImageToCloudinary(req.file.path, 'avatar');
  })
  .then( async result => {
    if (user.avatar && user.avatar != 'VexeOnlineMedia/imageDefault/no-image_ljozla') {
      await removeImageFromCloudinary(user.avatar);
    }
    user.avatar = result.public_id
    return user.save()
  })
  .then(user => res.status(200).json(user))
  .catch(err =>{
    if (err.status === 404) return res.status(err.status).json({message : err.message})
    return res.json(err);
  })
}
module.exports = {
  postUsers,
  login,
  uploadAvatar
}