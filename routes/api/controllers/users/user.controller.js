const { User } = require('../../../../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');//built-in package
const _ = require('lodash');
const { uploadImageToCloudinary, removeImageFromCloudinary } = require('../../../../middlewares/uploadImageToCloudinary');


// register users
const jwtSign = promisify(jwt.sign);
const postUsers = (req, res, next) => {
  const { email, password, fullName, phone, userType } = req.body;
  let newUser = new User({ email, password, fullName, phone, userType });
  newUser.save()
    .then(user => res.status(200).json(user))
    .catch(err => res.json(err))


};
const login = (req, res, next) => {
  const { email, password } = req.body;
  let _user;
  User.findOne({ email })
    .then(user => {
      if (!user) return Promise.reject({ status: 400, message: "Email not found" })
      _user = user;
      return bcrypt.compare(password, user.password)
    })
    .then(isMatched => {
      if (!isMatched) return Promise.reject({ status: 400, message: "Wrong password" });
      const payload = _.pick(_user, ['email', '_id', 'fullName', 'userType', "avatar", "phone"]);
      return jwtSign(
        payload,
        'TriMinh',
        { expiresIn: 3600 }
      )
    })
    .then(token => res.status(200).json({ message: "Success", token }))
    .catch(err => {
      if (err.status === 400) return res.status(err.status).json({ message: err.message })
      return res.json(err);
    })
};

const uploadAvatar = (req, res, next) => {
  let user = null;
  const { email } = req.user
  User.findOne({ email })
    .then((_user) => {
      if (!_user) return Promise.reject({
        status: 404,
        message: 'Email not exist'
      })
      user = _user;
      return uploadImageToCloudinary(req.file.path, 'avatar');
    })
    .then(async result => {
      if (user.avatar && user.avatar != 'VexeOnlineMedia/imageDefault/no-image_ljozla') {
        await removeImageFromCloudinary(user.avatar);
      }
      user.avatar = result.public_id
      return user.save()
    })
    .then(user => res.status(200).json(user))
    .catch(err => {
      if (err.status === 404) return res.status(err.status).json({ message: err.message })
      return res.json(err);
    })
}

const putUserById = (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .then(user => {
      if (!user) return new Promise.reject({
        status: 404,
        message: "User not found"
      });
      const keys = ['email', 'password', 'fullName', 'phone']
      keys.forEach(key => {
        user[key] = req.body[key]
      })
      return user.save()
    })
    .then(user => res.status(200).json(user))
    .catch(err => res.status(500).json(err))
}

const deleteUserById = (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .then(async user => {
      if (!user) return new Promise.reject({
        status: 404,
        message: "User not found"
      });

      if (user.avatar && user.avatar != 'VexeOnlineMedia/imageDefault/no-image_ljozla') {
        await removeImageFromCloudinary(user.avatar);
      }
      return user.deleteOne({ _id: id })
    })
    .then(result => {
      if (result.deletedCount == 0) return res.status(404).json({
        status: 404,
        message: "User not found"
      })
      return res.status(200).json(result);
    })
    .catch(err => res.status(500).json(err));
}
const getUsers = (req, res, next) => {
  User.find({ userType: 'client' })
    .then(users => {
      const _users = users.map(user => {
        return _.chain(user)
          .get("_doc")
          .assign({
            denyEdit: true
          })
      })
      res.status(200).json(_users)
    })
    .catch(err => {
      res.status(500).json(err)
    })
}
const getUsersAdmin = (req, res, next) => {
  User.find({ userType: 'admin' })
    .then(user => {
      res.status(200).json(user)
    })
    .catch(err => {
      res.status(500).json(err)
    })
}
const putUserAdmin = (req, res, next) => {
  User.find({ userType: 'admin' })
    .then(user => {
      if (!user) return new Promise.reject({
        status: 404,
        message: "User not found"
      });
      const keys = ['email', 'fullName', 'phone']
      keys.forEach(key => {
        user[key] = req.body[key]
      })
      return user.save()
    })
    .then(user => res.status(200).json(user))
    .catch(err => res.status(500).json(err))
};

const loginFacebook = (req, res, next) => {
  const { email, fullName, facebookId, accessToken } = req.body
  User.findOne({ email })
    .then(user => {
      if (user) {
        user.fullName = fullName
        user.facebook.id = facebookId
        user.accessToken = accessToken
        return user.save()
      } else {
        const newUser = new User({
          email,
          fullName,
          facebook: {
            id: facebookId,
            accessToken: accessToken
          },
          password : Math.floor((Math.random() * 1000000000))
        })
        return newUser.save()
      }
    })
    .then(async user => {
      if (user) {
        const payload = _.pick(user, ['email', '_id', 'fullName', 'userType', "avatar", "phone"]);
        const token = await jwtSign(
          payload,
          'TriMinh',
          { expiresIn: 3600 }
        )
        return res.status(200).json({ message: "Success", token })
      }
    })
}
module.exports = {
  postUsers,
  login,
  uploadAvatar,
  getUsers,
  putUserById,
  deleteUserById,
  getUsersAdmin,
  putUserAdmin,
  loginFacebook
}