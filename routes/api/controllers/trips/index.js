const express = require('express');
const tripController = require("./trip.controller");


const router = express.Router()

router.get("/", tripController.getTrips);
router.post("/", tripController.postTrips);
router.get("/:id", tripController.getTripById);
router.patch("/:id", tripController.patchTripById);
router.delete("/:id", tripController.deleteTripById);

module.exports = router