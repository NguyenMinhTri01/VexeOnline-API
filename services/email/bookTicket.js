const nodemailer = require("nodemailer");
const fs = require ('fs'); //node api
const hogan = require("hogan.js");
const { Station } = require("./../../models/Station");

const template = fs.readFileSync("services/email/templateSentMail.hjs", "utf-8");
const compiledTemplate = hogan.compile(template);


module.exports.sendBookTicketEmail = (ticket, trip, user) => {
  const transport = {
    host : "smtp.gmail.com",
    port : 587,
    secure : false,
    requireTLS: true,
    requireSSL : true,
    auth : {
      user: 'vexerecybersoft@gmail.com',
      pass: '@0387282390@'
    }
  }
  const transporter = nodemailer.createTransport(transport);

  const mailOptions = {
    from : "vexerecybersoft@gmail.com",
    to: "nguyenminhtri07011999@gmail.com",
    subject: "Mail xac nhan da mua ve thành công",
    html : compiledTemplate.render({
      email: user.email,
      fromStation : trip.fromStationId.name,
      toStation : trip.toStationId.name,
      price: trip.price,
      amount:ticket.seats.length,
      total : trip.price * ticket.seats.length,
      seatCodes : ticket.seats.map(m => m.code).join(", ")
    })
  }
  transporter.sendMail(mailOptions, err =>{
    if(err) console.log(err);
  })
}

