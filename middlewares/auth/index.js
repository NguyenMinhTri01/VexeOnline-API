const jwt = require('jsonwebtoken');
const { promisify } = require('util');






const jwtVerify = promisify(jwt.verify);
module.exports.authenticate = (req, res, next) => {
  const token = req.header("token");
  if (!token) return res.status(401).json({ message: "token is required" })
  jwtVerify(token, 'TriMinh')
    .then(decoded => {
      req.user = decoded,
        next();
    })
    .catch(err => res.status(401).json({ message: "token invalid" }))
};
module.exports.authorize = (userTypeArray) => {
  return (req, res, next) => {
    const { user } = req;
    if (userTypeArray.indexOf(user.userType) === -1) {
      res.status(403).json({ message: "You are not have permission to access" })
      return
    }
    next();
  }
};

module.exports.authenticateForUser = (req, res, next) => {
  const token = req.header("token");
  if (!token) {
    req.user = 'guest';
    return next();
  }
  jwtVerify(token, 'TriMinh')
    .then(decoded => {
      req.user = decoded,
        next();
    })
    .catch(err => res.status(401).json({ message: "token invalid" }))
}