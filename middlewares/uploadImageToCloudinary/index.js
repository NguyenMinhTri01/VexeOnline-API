
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
dotenv.config();
const fs = require('fs-extra');
const { promisify } = require('util');

cloudinary.config({
  cloud_name: `${process.env.CLOUD_NAME}`,
  api_key: `${process.env.API_KEY}`,
  api_secret: `${process.env.API_SECRET}`
});




/**
 * 
 * @param {*} folderName url folder to save image in cloudinary, example : vexerevn/example
 * @param {*} path path of image on local to upload 
 */
const uploadImageToCloudinary = (path, folderName) => {
  return new Promise((resolve, reject) => {
    // upload image to cloudinary
    const cloudinaryUploadImage = promisify(cloudinary.uploader.upload);
    
    try {
      cloudinaryUploadImage(path, {
        folder: `${process.env.FOLDER_ROOT}/${folderName}`,
        use_filename: true,
        unique_filename: false
      })
      .then(result => {
        if (result) {
          // remove file from folder location
          fs.remove(path, (err) => {
            return resolve(result);
          });
        } else {
          resolve(false);
        }
      })
      .catch(err => {
        resolve(false)
      })
    } catch (error) {
      console.log(error)
    }

  })
};

/**
 * 
 * @param {*} public_id CDN image in cloudinary
 */
const removeImageFromCloudinary = (public_id) => {
  return new Promise((resolve, reject) => {
    const cloudinaryDestroyImage = promisify(cloudinary.uploader.destroy);
    cloudinaryDestroyImage(public_id)
      .then(res => {
        if (res.result === 'ok') return resolve(true)
        resolve(false);
      })
  })
}


module.exports = {
  uploadImageToCloudinary,
  removeImageFromCloudinary
}

