const QRCode = require("qrcode")
const ical = require("ical-generator")
const moment = require("../moment")
const constants = require("../constants")

export const getQRCode = reservationId =>
  QRCode.toDataURL(`${constants.ADMIN_ROOT}/foglalasok/${reservationId}/ervenyesseg`)

export const getIcalEvent = ({timestamp, id, roomId, address, email, tel, name, from, to, message, adults, children}) => {
  const cal = ical()
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
