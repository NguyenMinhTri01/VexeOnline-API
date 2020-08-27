const express = require('express');
const tripController = require("./trip.controller");
const { authenticate, authorize } = require("./../../../../middlewares/auth");
const { validatePostTrip, validatePutTrip } = require("./../../../../middlewares/validation/trips");
const { route } = require('../vehicles');
const router = express.Router()

router.get("/", tripController.getTrips);

router.get("/:id", tripController.getTripById);

router.post("/",
  authenticate,
  authorize(["admin"]),
  validatePostTrip, 
  tripController.postTrip
);

router.put("/:id",
  authenticate,
  authorize(["admin"]),
  validatePutTrip, 
  tripController.putTrip
);

router.get(
  "/status-number/:id",
  authenticate, 
  authorize(["admin"]), 
  tripController.updateTripStatusNumber);

router.delete(
  "/:id",
  authenticate, 
  authorize(["admin"]),  
  tripController.deleteTripById);

module.exports = router