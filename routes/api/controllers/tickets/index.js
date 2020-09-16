const express = require('express');

const ticketController = require("./ticket.controller");
const { authenticate, authorize, authenticateForUser } = require("./../../../../middlewares/auth")


const router = express.Router()

router.get("/", authenticate, authorize(["admin"]), ticketController.getTickets);
router.post(
  "/",
  authenticateForUser,
  ticketController.createTicket);
router.get("/code/:code/phone/:phone", ticketController.getTicketByCode);
router.get("/cancel/:id", ticketController.cancelTicket)
router.get(
  "/history",
  authenticateForUser,
  ticketController.getBookingHistory);
// router.get("/:id", ticketController.getTicketById);
// router.patch("/:id", tripController.patchTripById);
// router.delete("/:id", tripController.deleteTripById);

module.exports = router