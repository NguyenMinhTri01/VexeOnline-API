const express = require('express');

const ticketController = require("./ticket.controller");
const { authenticate, authorize, authenticateForUser } = require("./../../../../middlewares/auth")


const router = express.Router()

router.get("/",authenticate, authorize(["admin"]), ticketController.getTickets);
router.post(
  "/",
  authenticateForUser,
  ticketController.createTicket);
// router.get("/:id", ticketController.getTicketById);
// router.patch("/:id", tripController.patchTripById);
// router.delete("/:id", tripController.deleteTripById);

module.exports = router