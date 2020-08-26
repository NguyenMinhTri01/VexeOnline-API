const { Garage } = require('../../../../models/Garage');
const _ = require('lodash');
const { uploadImageToCloudinary, removeImageFromCloudinary } = require ('../../../../middlewares/uploadImageToCloudinary');

const getGarages = (req, res, next) => {
    Garage.find()
      .then((garages) => {
        res.status(200).json(garages);
      })
      .catch((err) => {
        res.status(500).json(err);
      })
};

  const postGarages = (req, res, next) => {
    const newGarage = new Garage(req.body);
    newGarage.save()
      .then(garage => {
        res.status(200).json(garage);
      })
      .catch(err => res.status(500).json(err));
  };
  
  const getGaragesById = (req, res, next) => {
    const { id } = req.params;
    Garage.findById(id)
      .then(garage => res.status(200).json(garage))
      .catch(err => res.status(500).json(err));
  };

  const putGarageById = (req, res, next) => {
    const { id } = req.params;
    Garage.findById(id)
    .then((garage) => {
      if(!garage) return new Promise.reject({
        status: 404,
        message: "Garage not found"
      });
      const keys = ['name', 'address', 'content']
      keys.forEach(key=>{
        garage[key] = req.body[key]
      })
      return garage.save()
    })
    .then(garage => res.status(200).json(garage))
    .catch(err => res.status(500).json(err));
  };

  const deleteGaragesById = (req, res, next) => {
    const { id } = req.params;
    Garage.findById(id)
    .then(async garage => {
      if(!garage) return res.status(404).json({
        status: 404,
        message: "Garage not found"
      }) 
      if (garage.avatar && garage.avatar != 'VexeOnlineMedia/imageDefault/no-image_ljozla') {
        await removeImageFromCloudinary(garage.avatar);
      }
      return Garage.deleteOne({_id : id})
    })
    .then(result => {
      if (result.deletedCount == 0) return res.status(404).json({
        status: 404,
        message: "Garage not found"
      })
      return res.status(200).json(result);
    })
    .catch(err => res.status(500).json(err));
  };

  const updateGarageStatus = (req, res, next) => {
    const { id } = req.params;
    Garage.findById(id)
    .then (garage => {
      if(!garage) return new Promise.reject({
        status: 404,
        message: "Garage not found"
      });
      garage.status = !garage.status;
      return garage.save()
    })
    .then(garage => res.status(200).json(garage))
    .catch(err => res.status(500).json(err));
  }
  

  const uploadAvatar = (req, res, next) => {
    const { id } = req.params;
    let garage
    Garage.findById(id)
    .then (_garage => {
      if(!_garage) return new Promise.reject({
        status: 404,
        message: "Garage not found"
      });
      garage = _garage;
      return uploadImageToCloudinary(req.file.path, 'garage/avatar');
    })
    .then (async result => {
      if (garage.avatar && garage.avatar != 'VexeOnlineMedia/imageDefault/no-image_ljozla') {
        await removeImageFromCloudinary(garage.avatar);
      }
      garage.avatar = result.public_id
      return garage.save()
    })
    .then (garage => res.status(200).json(garage))
    .catch (err => res.status(500).json(err));
  }
  module.exports={
      getGarages,postGarages,getGaragesById,putGarageById,deleteGaragesById,updateGarageStatus,uploadAvatar
  }