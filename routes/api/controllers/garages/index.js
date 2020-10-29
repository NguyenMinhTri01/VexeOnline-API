const express = require('express');
const { authenticate, authorize } = require("./../../../../middlewares/auth");
const { validatePostGarage, validatePutGarage } = require("./../../../../middlewares/validation/garages");
const { uploadSingleImage } = require("./../../../../middlewares/uploadImages")
const garageController = require('./garage.controller');
const router = express.Router();

router.get('/', garageController.getGarages);
router.get('/pagination', garageController.getPaginationGarages);
router.get('/count', garageController.getCountGarage);
router.get('/hotGarages', garageController.getGaragesHot);
router.get('/:id', garageController.getGaragesById);
router.get("/detail/:slug",garageController.getGaragesBySlug);
router.get('/status/:id',authenticate, authorize(["admin"]), garageController.updateGarageStatus);
router.get('/hot/:id',authenticate,authorize(['admin']),garageController.updateGarageHot);
router.post(
  '/',  
  authenticate,
  authorize(["admin"]),
  validatePostGarage,
  garageController.postGarages
);
router.put(
  '/:id',
  authenticate,
  authorize(["admin"]),
  validatePutGarage,
  garageController.putGarageById
);
router.delete(
  '/:id',
  authenticate,
  authorize(["admin"]),
  garageController.deleteGaragesById
);
router.patch(
  "/upload-avatar/:id",
  authenticate,
  authorize(["admin"]),
  uploadSingleImage('avatar'),
  garageController.uploadAvatar);


module.exports = router;