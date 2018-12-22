import QRCode from "qrcode"
import ical from "ical-generator"
import moment from "../moment"
import { ADMIN_ROOT, ADDRESS, WEB, ADMIN_EMAIL, APP_NAME } from "../constants"

export const getQRCode = reservationId =>
  QRCode.toDataURL(`${ADMIN_ROOT}/foglalasok/${reservationId}/ervenyesseg`)

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
    location: ADDRESS,
    url: WEB,
    attendees: [{email, name}],
    organizer: {
      email: ADMIN_EMAIL,
      name: APP_NAME
    }
  })

  return  ({
    filename: "event.ics",
    method: "request",
    content: cal.toString()
  })
}
