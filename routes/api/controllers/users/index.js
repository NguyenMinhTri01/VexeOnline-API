const express = require('express');

const userController = require("./user.controller");
const { authenticate, authorize } = require("./../../../../middlewares/auth")

const { uploadSingleImage } = require("./../../../../middlewares/uploadImages")

const { validatePostUser,validatePutUser } = require("./../../../../middlewares/validation/users")



const router = express.Router()
router.get(
  "/",
  authenticate,
  authorize(['admin']),
  userController.getUsers
);
router.post("/register", validatePostUser, userController.postUsers);
router.post("/login", userController.login);
router.put(
  "/:id",
  authenticate,
  authorize(['client']),
  validatePutUser,
  userController.putUserById
)
router.delete(
  '/:id',
  authenticate,
  authorize(["admin"]),
  userController.deleteUserById
);
router.patch("/upload-avatar",
  authenticate,
  uploadSingleImage('avatar'),
  userController.uploadAvatar);
// router.get("/:id", userController.getTripById);
// router.patch("/:id", userController.patchTripById);
// router.delete("/:id", userController.deleteTripById);

module.exports = router