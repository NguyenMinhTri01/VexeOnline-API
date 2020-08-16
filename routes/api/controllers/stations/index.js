const express = require('express');
const { authenticate, authorize } = require("./../../../../middlewares/auth");
// const validatePostStation = require ("../../../../middlewares/validation/stations/postStaion");
// const validatePutStation = require("../../../../middlewares/validation/stations/putStation");
const { validatePostStation, validatePutStation } = require("./../../../../middlewares/validation/stations");

const stationController = require('./station.controller');
const router = express.Router();


router.get('/', stationController.getStations);
router.get('/:id', stationController.getStationsById);
router.post(
  '/',
  authenticate,
  authorize(["admin"]),
  validatePostStation,
  stationController.postStations
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
  stationController.deleteStationsById
);


module.exports = router;