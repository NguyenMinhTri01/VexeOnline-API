const express = require('express');
const { authenticate, authorize } = require("./../../../../middlewares/auth");
const { validatePostStation, validatePutStation } = require("./../../../../middlewares/validation/stations");
const { uploadSingleImage } = require("./../../../../middlewares/uploadImages")
const stationController = require('./station.controller');
const router = express.Router();


router.get('/', stationController.getStations);
router.get('/:id', stationController.getStationById);
router.get('/status/:id',authenticate, authorize(["admin"]), stationController.updateStationStatus);
router.get('/hot/:id',authenticate, authorize(["admin"]), stationController.updateStationHot);
router.post(
  '/',  
  authenticate,
  authorize(["admin"]),
  validatePostStation,
  stationController.postStation
);
router.put(
  '/:id',
  authenticate,
  authorize(["admin"]),
  validatePutStation,
  stationController.putStationById
);
router.patch(
  '/:id',
  authenticate,
  authorize(["admin"]),
  stationController.patchStationById
);
router.delete(
  '/:id',
  authenticate,
  authorize(["admin"]),
  stationController.deleteStationById
);
router.patch(
  "/upload-avatar/:id",
  authenticate,
  authorize(["admin"]),
  uploadSingleImage('avatar'),
  stationController.uploadAvatar
);


module.exports = router;