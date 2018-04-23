const functions = require('firebase-functions')
const nodemailer = require("nodemailer")
const moment = require("./moment")
const emailTemplates = require("./email.templates")


// Init email
const {email: user, password: pass} = functions.config().gmail
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {user, pass}
}) 

// Global variables
const APP_NAME = "Bíbic vendégházak"
const from = `${APP_NAME} 🏠 <szallasfoglalas@bibicvendeghazak.hu>`
const replyTo = "szallasfoglalas@bibicvendeghazak.hu"
const FOOTER = `Üdvözlettel ${APP_NAME}`



module.exports.reservationCreated = (reservationId, reservation) => {
	const mail = {
		from,
		replyTo,
		to: reservation.email
	}
	mail.subject = `Foglalását rögzítettük 🔔`
	mail.text = `
		Tisztelt ${reservation.name}!

		Foglalási kérelmét megkaptuk, az alábbi információkkal:
		Foglaló telefonszáma: ${reservation.tel}
		Foglalni kívánt szoba: Szoba ${reservation.roomId}
		Érkezés: ${moment(reservation.from).format("LLL")}
		Távozás: ${moment(reservation.to).format("LLL")}
		Felnőttek száma: ${reservation.adults}
		Gyerekek száma: ${(reservation.children && reservation.children.length) || "0"}
		Megjegyzés: ${reservation.message}
		Foglalási azonosító: ${reservationId}

		Mihamarabb értesítjük Önt a további teendőkről.

		${FOOTER}`

	return mailTransport
		.sendMail(mail)
		.then(() => console.log("Confirmation sent to ", reservation.email))
}



module.exports.reservationAccepted = (reservationId, reservation) => {
	console.log("Reservation accepted")
	const mail = {
		from,
		replyTo,
		to: reservation.email
	}
	mail.subject = `Foglalását elfogadtuk 🎉`
	mail.text = `
		Tisztelt ${reservation.name}!

		Foglalási kérelmét ezennel elfogadtuk, az alábbi információkkal:
		Foglaló telefonszáma: ${reservation.tel}
		Foglalni kívánt szoba: Szoba ${reservation.roomId}
		Érkezés: ${moment(reservation.from).format("LLL")}
		Távozás: ${moment(reservation.to).format("LLL")}
		Felnőttek száma: ${reservation.adults}
		Gyerekek száma: ${(reservation.children && reservation.children.length) || "0"}
		Megjegyzés: ${reservation.message}
		Foglalási azonosító: ${reservationId}
		
		${FOOTER}`

	mail.html = emailTemplates.reservationAcceptedTemplate(reservationId, reservation)

	return mailTransport
		.sendMail(mail)
		.then(() => console.log("Acception sent to ", reservation.email))

}



module.exports.reservationRejected = (to, name, remove=false) => {
	console.log(`Reservation ${remove ? "removed" : "rejected"}`)

	const action = remove ? "töröltük" : "visszautasítottuk"

	const mail = { from, replyTo, to }
	
	mail.subject = `Foglalását ${action} ❌`
	mail.text = `
		Tisztelt ${name}!

		Foglalását ${action}.
		Sajnáljuk.
		
		${FOOTER}`

	return mailTransport
		.sendMail(mail)
		.then(() => console.log("Rejection sent to ", to))
}



module.exports.reservationChanged = (oldReservation, reservation) => {
	console.log("Reservation details changed")
	const mail = {from, replyTo, to: reservation.email}
	// TODO: Mark changed elements
	mail.subject = `Foglalás módosítva 🔔`
	mail.text = `
		Tisztelt ${reservation.name}!

		Foglalása az alábbiak szerint módosul:
		Foglaló neve: ${reservation.name}
		Foglaló telefonszáma: ${reservation.tel}
		Foglalni kívánt szoba száma: ${reservation.roomId}
		Érkezés: ${moment(reservation.from).format("LLL")}
		Távozás: ${moment(reservation.to).format("LLL")}
		Felnőttek száma: ${reservation.adults}
		Gyerekek száma: ${(reservation.children && reservation.children.length) || "0"}
		Megjegyzés: ${reservation.message}

		${FOOTER}`

	return mailTransport
		.sendMail(mail)
		.then(() => console.log('Reservation change sent to ', reservation.to))
  }