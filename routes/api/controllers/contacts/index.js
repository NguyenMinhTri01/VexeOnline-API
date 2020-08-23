const express = require("express");
const router = express.Router();
const contactController = require("./contact.controller");
const { authenticate, authorize } = require("./../../../../middlewares/auth");


router.get(
    "/",
    authenticate,
    authorize(["admin"]),
    contactController.getContact
);
router.post("/",contactController.postContact);
router.delete(
    "/:id",
    authenticate,
    authorize(["admin"]),
    contactController.deleteContactById
);

module.exports = router;