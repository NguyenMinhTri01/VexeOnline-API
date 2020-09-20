const express = require('express');
const tripController = require("./trip.controller");
const { authenticate, authorize } = require("./../../../../middlewares/auth");
const { validatePostTrip, validatePutTrip } = require("./../../../../middlewares/validation/trips");
const { route } = require('../vehicles');
const router = express.Router()

router.get("/", tripController.getTrips);
router.get(
  "/count",
  authenticate,
  authorize(['admin']),
  tripController.getCountTrips
);
router.get("/:id", tripController.getTripById);
router.get("/from-station/:slug", tripController.getTripByFromStation);
router.post("/",
  authenticate,
  authorize(["admin"]),
  validatePostTrip,
  tripController.postTrip
);

router.post("/search-trips",
  tripController.searchTrips
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
  tripController.updateTripStatusNumber
);

router.delete(
  "/:id",
  authenticate,
  authorize(["admin"]),
  tripController.deleteTripById
);

module.exports = router