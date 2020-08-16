const express = require('express');

const userController = require("./user.controller");
const { authenticate, authorize } = require("./../../../../middlewares/auth")

const { uploadSingleImage } = require("./../../../../middlewares/uploadImages")

const { validatePostUser } = require("./../../../../middlewares/validation/users/postUser")



const router = express.Router()
router.post("/", validatePostUser, userController.postUsers);
router.post("/login", userController.login);
router.patch("/upload-avatar",
  authenticate,
  uploadSingleImage('avatar'),
  userController.uploadAvatar);
// router.get("/:id", userController.getTripById);
// router.patch("/:id", userController.patchTripById);
// router.delete("/:id", userController.deleteTripById);

module.exports = router