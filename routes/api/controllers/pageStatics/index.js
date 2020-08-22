const express = require("express");
const router = express.Router();
const pageStaticController = require("./pageStatic.controller")
const { authenticate, authorize } = require("./../../../../middlewares/auth");
const { validatePostPageStatic, validatePutPageStatic } = require("../../../../middlewares/validation/pageStatics");

router.get("/",pageStaticController.getPageStatic);
router.get("/:id",pageStaticController.getPageStaticById);
router.post(
    "/",
    authenticate,
    authorize(["admin"]),
    validatePostPageStatic,
    pageStaticController.postPageStatic
);
router.put(
    "/:id",
    authenticate,
    authorize(["admin"]),
    validatePutPageStatic,
    pageStaticController.putPageStaticById
);
router.delete(
    "/:id",
    authenticate,
    authorize(["admin"]),
    pageStaticController.deletePageStaticById
);


module.exports = router;
