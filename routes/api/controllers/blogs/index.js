const express = require("express");
const router = express.Router();
const blogController = require("./blog.controller")
const { authenticate, authorize } = require("./../../../../middlewares/auth");
//const {vadidatePostBlog} = require("../../../../middlewares/validation/blogs/postBlog")

router.get("/",blogController.getBlog);
router.get("/:id",blogController.getBlogById);
router.post(
    "/",
    authenticate,
    authorize(["admin"]),
   // vadidatePostBlog,
    blogController.postBlog
);
router.put(
    "/:id",
    authenticate,
    authorize(["admin"]),
    blogController.putBlogById
);
router.delete(
    "/:id",
    authenticate,
    authorize(["admin"]),
    blogController.deleteBlogById
);

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
module.exports = router;