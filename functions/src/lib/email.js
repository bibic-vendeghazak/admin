const functions = require("firebase-functions")
const nodemailer = require("nodemailer")
const templates = require("./templates")
const constants = require("./constants")
const QRCode = require("qrcode")
const ical = require("ical-generator")
const moment = require("./moment")
const cal = ical()


// Init email
const {email: user, password: pass} = functions.config().gmail

const mailTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {user, pass}
})



const getQRCode = reservationId =>
  QRCode.toDataURL(`${constants.ADMIN_ROOT}/foglalasok/${reservationId}/ervenyesseg`)

const getIcalEvent = ({timestamp, id, roomId, address, email, tel, name, from, to, message, adults, children}) => {
  cal.createEvent({
    start: from.toDate(),
    end: to.toDate(),
    summary: `Szobafoglalás (#${id})`,
    timezone: moment(from.toDate()).zoneName(),
    timestamp: timestamp.toDate(),
    description: `
név: ${name}
telefonszám: ${tel}
szoba: ${roomId}
lakcím: ${address}
felnőtt: ${adults}
gyerek: ${children.reduce((acc, {count}) => acc+count, 0)}
megjegyzés: ${message}

Szeretettel várjuk!
`,
    location: constants.ADDRESS,
    url: constants.WEB,
    attendees: [{email, name}],
    organizer: {
      email: constants.ADMIN_EMAIL,
      name: constants.APP_NAME
    }
  })

  return  ({
    filename: "event.ics",
    method: "request",
    content: cal.toString()
  })
}


// Possible messages
const messages = {
  accepted: {
    admin: {
      html: templates.adminHTML,
      subject: "Foglalás jóváhagyva 🎉",
      text: templates.adminText
    },
    user: {
      html: templates.acceptedHTML,
      text: templates.acceptedUserText,
      subject: "Foglalását jóváhagytuk 🎉"
    },
  },
  created: {
    admin: {
      html: templates.adminHTML,
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
      html: templates.adminHTML,
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
      html: templates.adminHTML,
      subject: "Foglalás módosítva ✍",
      text: templates.adminText
    },
    user: {
      html: templates.acceptedHTML,
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
module.exports.sendReservationEmail = (reservation, type, target) =>
  (
    (("created" === type ||"changedFirst" === type) && target === "user") ?
      getQRCode(reservation.reservationId) :
      Promise.resolve()
  )
    .then(attachment =>
      mailTransport.sendMail({
        replyTo: constants.ADMIN_EMAIL,
        from: constants.ADMIN_RESERVATION_EMAIL,
        to: target === "admin" ? constants.NO_REPLY : reservation.email,
        text: messages[type][target].text(reservation),
        html: messages[type][target].html(reservation),
        subject: messages[type][target].subject,
        icalEvent: attachment && getIcalEvent(reservation),
        attachments: attachment && ([{
          content: attachment.split("base64,")[1],
          encoding: "base64",
          name: "qr.png",
          cid: "qr-code-123" //same cid value as in the html img src
        }])
      }))
    .then(() => console.log(`E-mail sent to ${target}`))


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