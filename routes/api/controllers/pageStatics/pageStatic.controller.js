const {PageStatic} = require("../../../../models/PageStatic");
const getPageStatic = (req,res,next) => {
    PageStatic.find()
    .then(pageStatic=>{
        res.status(200).json(pageStatic)
    })
    .catch(err=>{
        res.status(500).json(err)
    })
}

const postPageStatic = (req,res,next) => {
    const {name,content} =  req.body;
    const newPageStatic = new PageStatic({name,content});
    newPageStatic.save()
    .then(pageStatic=>{
        res.status(200).json(pageStatic)
    })
    .catch(err=>{
        res.status(500).json(err)
    })
}

const getPageStaticById = (req,res,next) => {
    const {id} = req.params;
    PageStatic.findById(id)
    .then(pageStatic=>res.status(200).json(pageStatic))
    .catch(err=>res.status(500).json(err))
}

const putPageStaticById = (req,res,next) => {
    const {id} = req.params;
    PageStatic.findById(id)
    .then(pageStatic => {
        if(!pageStatic) return Promise.reject({
            status: 404,
            message: "Page Static not found"
        })
        const keys = ["name","content"]
        keys.forEach(key=>{
            pageStatic[key] = req.body[key]
        })
        return pageStatic.save()
    })
    .then(pageStatic=>res.status(200).json(pageStatic))
    .catch(err=>res.status(500).json(err))
}

const deletePageStaticById = (req,res,next) => {
    const {id} = req.params;
    let _pageStatic;
    PageStatic.findById(id)
    .then(pageStatic=>{
        _pageStatic = pageStatic;
        if(!pageStatic) return Promise.reject({
            status: 404,
            message: "Page Static not found"
        })
        return PageStatic.deleteOne({_id:id})
    })
    .then(()=>res.status(200).json(_pageStatic))
    .catch(err=>res.status(500).json(err))
}

module.exports={
    getPageStatic,postPageStatic,getPageStaticById,putPageStaticById,deletePageStaticById
}