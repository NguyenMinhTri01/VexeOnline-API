const express = require('express');

const ticketController = require("./ticket.controller");
const { authenticate, authorize, authenticateForUser } = require("./../../../../middlewares/auth")


const router = express.Router()

router.get("/", authenticate, authorize(["admin"]), ticketController.getTickets);
router.get(
  "/statusTicket/:id",
  authenticate,
  authorize(["admin"]),
  ticketController.getstatusTicketById
);
router.post(
  "/",
  authenticateForUser,
  ticketController.createTicket);
// router.get("/code/:code", ticketController.getTicketByCode);
// router.get(
//   "/history",
//   authenticateForUser,
//   ticketController.getBookingHistory);
// router.get("/:id", ticketController.getTicketById);
// router.patch("/:id", tripController.patchTripById);
// router.delete("/:id", tripController.deleteTripById);

router.delete(
  "/:id",
  authenticate,
  authorize(["admin"]),
  ticketController.deleteTicketById
);

module.exports = router