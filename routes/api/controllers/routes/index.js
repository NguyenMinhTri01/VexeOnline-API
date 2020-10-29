const express = require("express");
const router = express.Router();
const routeController = require("./route.controller")
const { authenticate, authorize } = require("./../../../../middlewares/auth");
const { validatePostRoute, validatePutRoute } = require("../../../../middlewares/validation/routes");

router.get("/",routeController.getRoutes);
router.get('/pagination', routeController.getPaginationRoutes);
router.get('/count', routeController.getCountRoutes);
router.get("/hotRoutes",routeController.getRoutesHot);
router.get("/:id",routeController.getRouteById);
router.get(
    "/status/:id",
    authenticate,
    authorize(["admin"]),
    routeController.getStatusById
);

router.get(
    "/hot/:id",
    authenticate,
    authorize(["admin"]),
    routeController.getHotById
);
router.post(
    "/",
    authenticate,
    authorize(["admin"]),
    validatePostRoute,
    routeController.postRoutes
);
router.put(
    "/:id",
    authenticate,
    authorize(["admin"]),
    validatePutRoute,
    routeController.putRouteById
);
router.delete(
    "/:id",
    authenticate,
    authorize(["admin"]),
    routeController.deleteRouteById
);


module.exports = router;
