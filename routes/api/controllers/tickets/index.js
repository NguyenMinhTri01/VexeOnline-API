const express = require('express');

const ticketController = require("./ticket.controller");
const { authenticate, authorize, authenticateForUser } = require("./../../../../middlewares/auth")


const router = express.Router()

router.get("/", authenticate, authorize(["admin"]), ticketController.getTickets);
router.get("/count", authenticate, authorize(["admin"]), ticketController.getCountTickets);
router.get("/latest", authenticate, authorize(["admin"]), ticketController.getLatestTickets);
router.get("/searchCode", authenticate, authorize(["admin"]), ticketController.searchByCode);
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
  
router.get("/code/:code/phone/:phone", ticketController.getTicketByCode);

router.get("/cancel/:id", ticketController.cancelTicket)

router.get(
  "/history",
  authenticate,
  authorize(["client"]),
  ticketController.getBookingHistory);

router.get("/:id", ticketController.getTicketById);

// router.patch("/:id", tripController.patchTripById);
// router.delete("/:id", tripController.deleteTripById);

router.delete(
  "/:id",
  authenticate,
  authorize(["admin"]),
  ticketController.deleteTicketById
);

module.exports = router