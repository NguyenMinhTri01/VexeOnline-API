const {Contact} = require("../../../../models/Contact");
const getContact = (req,res,next) =>{
    Contact.find()
    .then(contacts=>{
        res.status(200).json(contacts)
    }).catch(err=>{
        res.status(500).json(err)
    })
}

const postContact = (req,res,next)=>{
    const {name,email,phone,content} = req.body;
    const newContact = new Contact({name,email,phone,content});
    newContact.save()
    .then(contact=>{
        res.status(201).json(contact);
    })
    .catch(err=>{
        res.status(500).json(err);
    })
}

const deleteContactById = (req,res,next) => {
    const {id} = req.params;
    let _contact;
    Contact.findById(id)
    .then(contact=>{
        _contact = contact;
        if(!contact) return Promise.reject({
            status: 404,
            message: "Contact not found"
        })
        return Contact.deleteOne({_id:id})
    })
    .then(()=>res.status(200).json(_contact))
    .catch(err=>res.status(500).json(err))
}

module.exports = {
    getContact,postContact,deleteContactById
}