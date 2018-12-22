const functions = require("firebase-functions")
const nodemailer = require("nodemailer")
const templates = require("./templates")
const constants = require("../constants")
const attachments = require("./attachments")
import { acceptedUserText, adminMessage, adminText, changedFirstUserText, changedUserText, createdUserText, deletedUserText, reservationHTML, userMessage, feedbackHTML } from "./templates"

// Init email
const {email: user, password: pass} = functions.config().gmail

const mailTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {user, pass}
})



// Possible messages
const messages = {
  accepted: {
    admin: {
      html: reservation => templates.reservationHTML("admin", "default", reservation),
      subject: "Foglalás jóváhagyva 🎉",
      text: templates.adminText
    },
    user: {
      html: reservation => templates.reservationHTML("user", "accepted", reservation),
      text: templates.acceptedUserText,
      subject: "Foglalását jóváhagytuk 🎉"
    },
  },
  created: {
    admin: {
      html: reservation => templates.reservationHTML("admin", "default", reservation),
      subject: "Új foglalás 🔔",
      text: templates.adminText
    },
    user: {
      html: () => null,
      text: templates.createdUserText,
      subject: "Foglalása jóváhagyásra vár 🔔"
    },
  },
  changed: {
    admin: {
      html: reservation => templates.reservationHTML("admin", "default", reservation),
      subject: "Foglalás módosítva ✍",
      text: templates.adminText
    },
    user: {
      html: () => null,
      subject: "Foglalását módosítottuk ✍",
      text: templates.changedUserText
    }
  },
  changedFirst: {
    admin: {
      html: reservation => templates.reservationHTML("admin", "default", reservation),
      subject: "Foglalás módosítva ✍",
      text: templates.adminText
    },
    user: {
      html: reservation => templates.reservationHTML("user", "accepted", reservation),
      subject: "Foglalás rögzítve ✍",
      text: templates.changedFirstUserText
    }
  },
  deleted: {
    admin: {
      html: () => null,
      subject: "Foglalás törölve ❌",
      text: templates.adminText
    },
    user: {
      html: () => null,
      subject: "Foglalását töröltük ❌",
      text: templates.deletedUserText
    }
  }
}


/**
 *
 * @param {object} reservation
 * @param {string} type One of: created, accepted, deleted, rejected, changed, changedFirst
 * @param {string} target who will receive the e-mail
 */
module.exports.sendReservationEmail = async (reservation, type, target) => {
  const mail = await {
    replyTo: constants.ADMIN_EMAIL,
    from: constants.ADMIN_RESERVATION_EMAIL,
    to: target === "admin" ? constants.NO_REPLY : reservation.email,
    text: messages[type][target].text(reservation),
    subject: messages[type][target].subject,
  }
  try {
    mail.html = await messages[type][target].html(reservation)

    if (["accepted", "changedFirst"].includes(type) && target === "user") {
      const QRCode = await attachments.getQRCode(reservation.reservationId)
      mail.icalEvent = attachments.getIcalEvent(reservation)
      mail.attachments = [{
        content: QRCode.split("base64,")[1],
        encoding: "base64",
        name: "qr.png",
        cid: "qr-code-123" //same cid value as in the html img src
      }]
    }

    await mailTransport.sendMail(mail)
    console.log(`E-mail sent to ${target}`)
  } catch (error) {console.error(error)}
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
export const sendFeedbackEmails = async emails =>
  emails.map(async (reservation) => {
    const mail = {
      replyTo: ADMIN_EMAIL,
      from: ADMIN_RESERVATION_EMAIL,
      to: reservation.email,
      subject: "Reméljük, hogy jól érezte magát! 👌"
    }
    mail.html = await feedbackHTML(reservation)
    await mailTransport.sendMail(mail)
      .then(() => RESERVATIONS_FS.doc(reservation.reservationId).update({archived: true}))
    console.log(`Feedback sent, reservation ${reservation.reservationId} archived`)
  })