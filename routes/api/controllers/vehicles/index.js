const express = require('express');
const { authenticate, authorize } = require("./../../../../middlewares/auth");
const { validatePostVehicle, validatePutVehicle } = require("./../../../../middlewares/validation/vehicles");
const { uploadSingleImage, uploadListImage } = require("./../../../../middlewares/uploadImages")
const vehicleController = require('./vehicle.controller');
const router = express.Router();


router.get('/', vehicleController.getVehicles);
router.get('/:id', vehicleController.getVehicleById);

router.get(
  '/status/:id',
  authenticate,
  authorize(["admin"]),
  vehicleController.updateVehicleStatus
);

router.post(
  '/',
  // authenticate,
  // authorize(["admin"]),
  // validatePostVehicle,
  vehicleController.postVehicle,
  vehicleController.saveListImagesOfVehicle
);

router.put(
  '/:id',
  authenticate,
  authorize(["admin"]),
  validatePutVehicle,
  vehicleController.putVehicle,
  vehicleController.saveListImagesOfVehicle
);

router.delete(
  '/:id',
  authenticate,
  authorize(["admin"]),
  vehicleController.deleteVehicleById
);
router.patch(
  "/upload-avatar/:id",
  authenticate,
  authorize(["admin"]),
  uploadSingleImage('avatar'),
  vehicleController.uploadAvatar
);

router.post(
  "/upload-images/:userId",
  authenticate,
  authorize(["admin"]),
  uploadListImage('fileImage'),
  vehicleController.uploadMultipleImage
);

router.delete(
  '/:id/images/:imageId',
  authenticate,
  authorize(["admin"]),
  vehicleController.deleteImageOfVehicle
);


module.exports = router