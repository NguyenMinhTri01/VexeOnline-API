const nodemailer = require("nodemailer");
const fs = require('fs'); //node api
const hogan = require("hogan.js");
const { Ticket } = require("./../../models/Ticket");
const { result } = require("lodash");


const template = fs.readFileSync("services/email/templateSentMail.hjs", "utf-8");
const compiledTemplate = hogan.compile(template);


module.exports.sendBookTicketEmail = (ticketId, user) => {
  return new Promise((resolve, reject) => {
    Ticket.findById(ticketId)
      .populate({
        path: "tripId",
        select: 'garageId routeId vehicleId price startTime endTime -_id',
        populate: {
          path: 'garageId routeId vehicleId',
          select: 'name',
          populate: {
            path: 'fromStationId toStationId',
            select: "name "
          },
        },
      })
      .then(ticket => {
        const transport = {
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          requireTLS: true,
          requireSSL: true,
          auth: {
            user: 'vexeonline365@gmail.com',
            pass: 'VexeOnline@2020'
          }
        };
        
        const transporter = nodemailer.createTransport(transport);
        const mailOptions = {
          from: "vexeonline365@gmail.com",
          to: `${user.email}`,
          subject: `Mail xác nhận đã mua vé thành công, mã vé : ${ticket.code}`,
          html: compiledTemplate.render({
            user,
            code : ticket.code,
            fromStation: ticket.tripId.routeId.fromStationId.name,
            toStation: ticket.tripId.routeId.toStationId.name,
            price: ticket.tripId.price,
            amount: ticket.seats.length,
            total: ticket.tripId.price * ticket.seats.length,
            seatCodes: ticket.seats.map(m => m.code).join(", ")
          })
        }
        transporter.sendMail(mailOptions, err => {
          if (err) return reject(err)
          return resolve(ticket)
        })
      })
  })
}

