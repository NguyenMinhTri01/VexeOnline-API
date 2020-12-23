const { Vehicle } = require('../../../../models/Vehicle');
const { uploadImageToCloudinary, removeImageFromCloudinary } = require('../../../../middlewares/uploadImageToCloudinary');
const fs = require("fs-extra");
const { promisify } = require('util');
const path_ = require('path');
const { Image } = require('../../../../models/Image');
const { validatePutVehicle } = require('../../../../middlewares/validation/vehicles/putVehicle');

const getVehicles = (req, res, next) => {
  Vehicle.find()
    .then((vehicles) => {
      res.status(200).json(vehicles);
    })
    .catch((err) => {
      res.status(500).json(err);
    })
};

const getPaginationVehicles = (req, res, next) => {
  const page = parseInt(req.query.page);
  const page_size = 5;
  Vehicle.find()
  .skip((page-1)*page_size)
  .limit(page_size)
  .sort({createdAt:1})
  .then(vehicles=>{
    res.status(200).json(vehicles)
  })
  .catch(err=>{
    res.status(500).json(err)
  })
}

const getCountVehicles = (req,res,next) => {
  Vehicle.find()
  .countDocuments()
  .then(vehicles=>{
    res.status(200).json(vehicles)
  })
  .catch(err=>{
    res.status(500).json(err)
  })
}

const getVehicleById = (req, res, next) => {
  const { id } = req.params;
  Vehicle.findById(id)
    .then(vehicle => {
      if (!vehicle) return new Promise.reject({
        status: 404,
        message: "Vehicle not found"
      });
      res.status(200).json(vehicle)
    })
    .catch(err => res.status(500).json(err));
};


const postVehicle = (req, res, next) => {
  const newVehicle = new Vehicle({
    name : req.body.name,
    numberOfSeats : req.body.numberOfSeats,
    utilities : req.body.utilities
  });
  newVehicle.save()
    .then(vehicle => {
      req.vehicle = vehicle
      return next();
    })
    .catch(err => {
      console.log(err)
      res.status(500).json(err)});
};

const updateVehicleStatus = (req, res, next) => {
  const { id } = req.params;
  Vehicle.findById(id)
    .then(vehicle => {
      if (!vehicle) return new Promise.reject({
        status: 404,
        message: "Vehicle not found"
      });
      vehicle.status = !vehicle.status;
      return vehicle.save()
    })
    .then(vehicle => {
      res.status(200).json(vehicle)
    })
    .catch(err => res.status(500).json(err));

};

const putVehicle = (req, res, next) => {
  const { id } = req.params;
  Vehicle.findById(id)
    .then((vehicle) => {
      if (!vehicle) return new Promise.reject({
        status: 404,
        message: "Vehicle not found"
      });
      const keys = ['name', 'numberOfSeats', 'utilities']
      keys.forEach(key => {
        vehicle[key] = req.body[key]
      })
      return vehicle.save()
    })
    .then(vehicle => {
      req.vehicle = vehicle
      return next();
    })
    .catch(err => res.status(500).json(err));

};

const deleteVehicleById = (req, res, next) => {
  const { id } = req.params;
  Vehicle.findById(id)
    .then(async vehicle => {
      if (!vehicle) return res.status(404).json({
        status: 404,
        message: "Vehicle not found"
      })
      if (vehicle.avatar && vehicle.avatar != 'VexeOnlineMedia/imageDefault/no-image_ljozla') {
        await removeImageFromCloudinary(vehicle.avatar);
      }
      if (vehicle.listImages) {
        (vehicle.listImages.forEach(async image => {
          await removeImageFromCloudinary(image.public_id);
        }))
      }
      return Vehicle.deleteOne({ _id: id })
    })
    .then(result => {
      if (result.deletedCount == 0) return res.status(404).json({
        status: 404,
        message: "Vehicle not found"
      })
      return res.status(200).json(result);
    })
    .catch(err => res.status(500).json(err));
};

const uploadAvatar = (req, res, next) => {
  const { id } = req.params;
  let vehicle = null;
  Vehicle.findById(id)
    .then(_vehicle => {
      if (!_vehicle) return new Promise.reject({
        status: 404,
        message: "Vehicle not found"
      });
      vehicle = _vehicle;
      return uploadImageToCloudinary(req.file.path, 'vehicle/avatar');
    })
    .then(async result => {
      if (vehicle.avatar && vehicle.avatar != 'VexeOnlineMedia/imageDefault/no-image_ljozla') {
        await removeImageFromCloudinary(vehicle.avatar);
      }
      vehicle.avatar = result.public_id
      return vehicle.save()
    })
    .then(vehicle => res.status(200).json(vehicle))
    .catch(err => res.status(500).json(err));
};

const uploadMultipleImage = (req, res, next) => {
  let fileName = req.file.filename
  res.status(200).json({ fileName })
};

const saveListImagesOfVehicle = (req, res, next) => {
  if (req.body.listImages.length != 0){
    if(!req.vehicle.listImages || req.vehicle.listImages.length === 0) {
      req.vehicle.listImages = []
    }
    const directoryPath = `./uploads/${req.user._id}`;
    const fsReaddir = promisify(fs.readdir);
    let vehicle = req.vehicle;
    fs.pathExists(directoryPath)
      .then(exists => {
        if (exists) return fsReaddir(directoryPath)
      })
      .then(async files => {
        if(files.length >= req.body.listImages.length){
          const _listImages = await Promise.all(req.body.listImages.map(async image => {
            const pathImage = path_.join(directoryPath, image);
            const result = await uploadImageToCloudinary(pathImage, 'vehicle/listImages')
            return new Image({ public_id: result.public_id });
          }))
          vehicle.listImages = [ ...vehicle.listImages ,..._listImages];
          return vehicle.save()
        }
      })
      .then(_vehicle => {
        if(_vehicle) {
          res.status(200).json(_vehicle)
          return fs.removeSync(directoryPath)
        };
      })
      .catch(err => console.log(err))
  } else {
    return res.status(200).json(req.vehicle)
  }
};

const deleteImageOfVehicle = (req, res, next) => {
  const { id, imageId } = req.params;
  Vehicle.findById(id)
  .then(async vehicle => {
    const image = vehicle.listImages.find(_image => _image._id == imageId)
    await removeImageFromCloudinary(image.public_id)
    vehicle.listImages = vehicle.listImages.filter(_image => _image._id != imageId)
    return vehicle.save()
  })
  .then(vehicle => res.status(200).json(vehicle))
  .catch(err => console.log(err))
}



module.exports = {
  getVehicles,
  postVehicle,
  getVehicleById,
  updateVehicleStatus,
  deleteVehicleById,
  uploadAvatar,
  putVehicle,
  uploadMultipleImage,
  saveListImagesOfVehicle,
  deleteImageOfVehicle,
  getPaginationVehicles,
  getCountVehicles
}