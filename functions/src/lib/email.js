const functions = require("firebase-functions")
const nodemailer = require("nodemailer")
const templates = require("./templates")
const constants = require("./constants")


// Init email
const {email: user, password: pass} = functions.config().gmail

const mailTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {user, pass}
})


/**
 *
 * @param {*} reservation
 * @param {*} type One of: created, accepted, deleted, rejected, changed
 */
module.exports.sendReservationEmails = (reservation, type) => {
	let userTextTemplate = null,
			htmlTemplate = null


	let userSubject = ""
	let adminSubject = ""
	switch (type) {
		case "created":
			console.log("Created reservation")
			userTextTemplate = templates.createdUserText(reservation, FOOTER, "user")
			userSubject = "Foglalása jóváhagyásra vár 🔔"
			adminSubject = "Új foglalás 🔔"
			break
			case "accepted":
			console.log("Accepted reservation")
			userTextTemplate = templates.acceptedUserText(reservation, FOOTER, "user")
			htmlTemplate = templates.acceptedHTML(reservation)
			userSubject = "Foglalását jóváhagytuk 🎉"
			adminSubject = "Foglalás jóváhagyva 🎉"
			break
		case "deleted":
			console.log("Deleted reservation")
			userTextTemplate = templates.deletedUserText(reservation, FOOTER, "user")
			userSubject = "Foglalását töröltük ❌"
			adminSubject = "Foglalás törölve ❌"
			break
		case "changed":
			console.log("Changed reservation")
			userTextTemplate = templates.changedUserText(reservation, FOOTER, "user")
			userSubject = "Foglalását módosítottuk ✍"
			adminSubject = "Foglalás módosítva ✍"
			break
	}

	return Promise
	.all([
		// To user
		{
			replyTo: adminEmailAddress,
			from: adminReservationEmail,
			to: reservation.email,
			text: userTextTemplate,
			html: htmlTemplate,
			subject: userSubject
		},
		// To admin
		{
			replyTo: reservation.email,
			from: adminReservationEmail,
			text: templates.adminText(reservation),
			html: templates.adminHTML(reservation),
			to: adminEmailAddress,
			subject: adminSubject
		}
	].map(mail =>
		mailTransport.sendMail(mail)
		.then(() => console.log("Email sent to ", mail.to))
	))
}


module.exports.sendMessageEmails = snap =>
  Promise.all([
    // To user
    {
      replyTo: constants.ADMIN_EMAIL,
      from: constants.ADMIN_RESERVATION_EMAIL,
      to: snap.val().email,
      text: templates.userMessage(snap.val(), FOOTER),
      subject: "Üzenetét megkaptuk 👍"
    },
    // To admin
    {
      replyTo: snap.val().email,
      from: snap.val().email,
      text: templates.adminMessage(snap.val()),
      to: constants.ADMIN_EMAIL,
      subject: "Új üzenet! 🔔"
    }
  ].map(mail =>
    mailTransport.sendMail(mail)
      .then(() => console.log("Email sent to ", mail.to))
  ))