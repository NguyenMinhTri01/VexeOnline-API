const {Blog} = require("../../../../models/Blog");
const getBlog = (req, res, next) => {
    Blog.find()
        .then(blogs => {
            res.status(200).json(blogs)
        })
        .catch(err => {
            res.status(500).json(err)
        })
}

const postBlog = (req,res,next) =>{
    const {name,description,content,titleSeo,descriptionSeo,keywordSeo} = req.body;
    const newBlog = new Blog({name,description,content,titleSeo,descriptionSeo,keywordSeo})
    newBlog.save()
    .then(blog=>{
        res.status(201).json(blog);
    })
    .catch(err=>res.status(500).json(err))
}

const getBlogById = (req,res,next) => {
    const {id} = req.params;
    Blog.findById(id)
    .then(blog=>res.status(200).json(blog))
    .catch(err=>res.status(500).json(err))
}

const putBlogById = (req,res,next) => {
    const {id} = req.params;
    Blog.findById(id)
    .then(blog => {
        if(!blog) return Promise.reject({
            status: 404,
            message: "Blog not found"
        })
        const keys = ["name","description","content","titleSeo","descriptionSeo","keywordSeo"]
        keys.forEach(key=>{
            blog[key] = req.body[key]
        })
        return blog.save()
    })
    .then(blog=>res.status(200).json(blog))
    .catch(err=>res.status(500).json(err))
}

const deleteBlogById = (req,res,next) => {
    const {id} = req.params;
    let _blog;
    Blog.findById(id)
    .then(blog=>{
        _blog = blog;
        if(!blog) return Promise.reject({
            status: 404,
            message: "Blog not found"
        })
        return Blog.deleteOne({_id:id})
    })
    .then(()=>res.status(200).json(_blog))
    .catch(err=>res.status(500).json(err))
}

const getStatusById = (req,res,next) => {
    const {id} = req.params;
    Blog.findById(id)
    .then(blog=>{
        if(!blog) return Promise.reject({
            status: 404,
            message: "Blog not found"
        })
        blog["status"] = !blog["status"];
        return blog.save()
    })
    .then(blog=>res.status(200).json(blog))
    .catch(err=>res.status(500).json(err))
}

const getHotById = (req,res,next) => {
    const {id} = req.params;
    Blog.findById(id)
    .then(blog=>{
        if(!blog) return Promise.reject({
            status: 404,
            message: "Blog not found"
        })
        blog["hot"] = !blog["hot"];
        return blog.save()
    })
    .then(blog=>res.status(200).json(blog))
    .catch(err=>res.status(500).json(err))
}
module.exports = {
    postBlog,getBlog,getBlogById,putBlogById,deleteBlogById,getStatusById,getHotById
}