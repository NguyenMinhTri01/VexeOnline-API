const multer  = require('multer');
const {Random} = require('random-js');

const uploadSingleImage = (type) => {

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      const random = new Random();
      const valueRandom = random.integer(0,1000);
      let extension = file.originalname.split('.').pop();
      const imageBrandName = `${Date.now()}-${valueRandom}.${extension}`;
      cb(null, imageBrandName);
    }
  });
  const upload = multer({ storage })
  return upload.single(`${type}`);
}

module.exports = {
  uploadSingleImage
}

