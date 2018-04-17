const functions = require('firebase-functions')
// const nodemailer = require('nodemailer')
const emailTemplates = require("./email.templates")
const moment = require('./moment')



// Init email
const nodemailer = require("nodemailer")
const {email: user, password: pass} = functions.config().gmail
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {user, pass}
}) 


// Global variables
const APP_NAME = "Bíbic vendégházak"
const from = `${APP_NAME}🏠 <szallasfoglalas@bibicvendeghazak.hu>`
const replyTo = "szallasfoglalas@bibicvendeghazak.hu"
const FOOTER = `Üdvözlettel ${APP_NAME}`

module.exports.reservationRecieved = (reservationId, to, reservation) => {
    const mail = {
        from,
        replyTo,
        to
    }
    mail.subject = `Foglalását rögzítettük ✔`
    mail.text = `
Tisztelt ${reservation.name}!

Foglalási kérelmét megkaptuk, az alábbi információkkal:
Foglaló telefonszáma: ${reservation.tel}
Foglalni kívánt szoba: Szoba ${reservation.roomId}
Érkezés: ${moment(reservation.from).format("LLL")}
Távozás: ${moment(reservation.to).format("LLL")}
Felnőttek száma: ${reservation.adults}
Gyerekek száma: ${(reservation.children && reservation.children.length) ? reservation.children.length : 0}
Megjegyzés: ${reservation.message}
Foglalási azonosító: ${reservationId}

Mihamarabb értesítjük Önt a további teendőkről.

${FOOTER}`

    return mailTransport
            .sendMail(mail)
            .then(() => console.log("Confirmation sent to ", to))

}

module.exports.reservationRejected = (to, name, action) => {
    const mail = {
        from,
        replyTo,
        to
    }
    mail.subject = `Foglalását ${action} ✖`
    mail.text = `
    Tisztelt ${name}!
  
    Foglalását ${action}.
    Sajnáljuk.
    
    ${FOOTER}`

    return mailTransport
            .sendMail(mail)
            .then(() => console.log("Rejection sent to ", to))

}

module.exports.reservationAccepted = (reservationId, to, reservation) => {
    const mail = {
        from,
        replyTo,
        to
    }
    mail.subject = `Foglalását elfogadtuk 🎉`
    mail.text = `
      Tisztelt ${reservation.name}!
      Foglalási kérelmét ezennel elfogadtuk, az alábbi információkkal:
      Foglaló telefonszáma: ${reservation.tel}
      Foglalni kívánt szoba: Szoba ${reservation.roomId}
      Érkezés: ${moment(reservation.from).format("LLL")}
      Távozás: ${moment(reservation.to).format("LLL")}
      Megjegyzés: ${reservation.message}
      Foglalási azonosító: ${reservationId}
      
     ${FOOTER}`

    mail.html = emailTemplates.reservationAcceptedTemplate(reservationId, reservation)

    return mailTransport
            .sendMail(mail)
            .then(() => console.log("Acception sent to ", to))

}

// module.exports.reservationChanged = (to, reservation) => {
//     const mail = {from, replyTo, to}
//     mail.subject = `Foglalás módosítva`
//     mail.text = `
//     Tisztelt ${reservation.name}!

//     Foglalása az alábbiak szerint módosul:
//     Foglaló neve: ${reservation.name}
//     Foglaló telefonszáma: ${reservation.tel}
//     Foglalni kívánt szoba száma: ${reservation.roomId}
//     Érkezés: ${moment(reservation.from).format("LLL")}
//     Távozás: ${moment(reservation.to).format("LLL")}
//     Felnőttek száma: ${reservation.adults}
//     Gyerekek száma: ${(reservation.children && reservation.children.length) ? reservation.children.length : 0}
//     Megjegyzés: ${reservation.message}

//     ${FOOTER}`

//     return mailTransport.sendMail(mail).then(() => console.log('Reservation change sent to ', to))

//   }