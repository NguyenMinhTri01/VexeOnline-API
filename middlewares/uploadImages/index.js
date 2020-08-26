const multer = require('multer');
const { Random } = require('random-js');
const fs = require('fs-extra');

const uploadSingleImage = (nameFileInput) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {

      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      let math = ["image/png", "image/jpeg"];
      if (math.indexOf(file.mimetype) === -1) {
        return cb("The file is invalid", null);
      }
      const random = new Random();
      const valueRandom = random.integer(0, 1000);
      let extension = file.originalname.split('.').pop();
      const imageName = `${Date.now()}-${valueRandom}.${extension}`;
      cb(null, imageName);
    }
  });
  const upload = multer({ storage })
  return upload.single(`${nameFileInput}`);
};

const uploadListImage = (nameFileInput) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const dir = `./uploads/${req.params.userId}`;
      fs.ensureDir(dir, err => cb(null, dir));
    },
    filename: function (req, file, cb) {
      let math = ["image/png", "image/jpeg"];
      if (math.indexOf(file.mimetype) === -1) {
        return cb("The file is invalid", null);
      }
      let extension = file.originalname.split('.').pop();
      const imageName = `${Date.now()}.${extension}`;
      cb(null, imageName);
    }
  });
  const upload = multer({ storage })
  return upload.single(`${nameFileInput}`);
}


module.exports = {
  uploadSingleImage,
  uploadListImage
}

