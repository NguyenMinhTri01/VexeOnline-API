const express = require('express');

const ticketController = require("./ticket.controller");
const { authenticate, authorize } = require("./../../../../middlewares/auth")


const router = express.Router()

router.get("/",authenticate, authorize(["admin"]), ticketController.getTickets);
router.post(
  "/",
  authenticate, 
  authorize(["client"]),
  ticketController.createTicket);
// router.get("/:id", ticketController.getTicketById);
// router.patch("/:id", tripController.patchTripById);
// router.delete("/:id", tripController.deleteTripById);

module.exports = router