const express = require("express");
const router = express.Router();
const blogController = require("./blog.controller")
const { authenticate, authorize } = require("./../../../../middlewares/auth");
const { validatePostBlog, validatePutBlog } = require("../../../../middlewares/validation/blogs");
//const {vadidatePostBlog} = require("../../../../middlewares/validation/blogs/postBlog")

router.get("/",blogController.getBlog);
router.get("/:id",blogController.getBlogById);
router.get(
    "/status/:id",
    authenticate,
    authorize(["admin"]),
    blogController.getStatusById
);

router.get(
    "/hot/:id",
    authenticate,
    authorize(["admin"]),
    blogController.getHotById
);
router.post(
    "/",
    authenticate,
    authorize(["admin"]),
    validatePostBlog,
    blogController.postBlog
);
router.put(
    "/:id",
    authenticate,
    authorize(["admin"]),
    validatePutBlog,
    blogController.putBlogById
);
router.delete(
    "/:id",
    authenticate,
    authorize(["admin"]),
    blogController.deleteBlogById
);


module.exports = router;
