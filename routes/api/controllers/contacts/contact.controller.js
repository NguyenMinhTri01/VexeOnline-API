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

module.exports = {
    getContact,postContact
}