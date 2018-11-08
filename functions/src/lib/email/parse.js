const generateURL = require("generate-google-calendar-url")
const moment = require("../moment")
const constants = require("../constants")


export const toPrice = price => parseInt(price, 10)
  .toLocaleString("hu-HU", {
    style: "currency",
    currency: "HUF",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  })

export const translateSubject = subject => {
  switch (subject) {
  case "eventHall":
    subject = "Rendezvényterem"
    break
  case "special":
    subject = "Külön ajánlat"
    break
  case "fullHouse":
    subject = "Teljes ház"
    break
  default:
    subject = "Egyéb"
    break
  }
  return subject
}

export const translateService = service => {
  switch (service) {
  case "halfBoard":
    service = "Félpanzió"
    break
  default:
    service = "Reggeli"
    break
  }
  return service
}

export const parseReservation = reservation => {
  const {from, to, message, price, foodService, lastHandledBy, timestamp} = reservation
  return ({
    ...constants,
    ...reservation,
    message: message !== "" ? message : "-",
    from: moment(from.toDate()).format("YYYY MMMM DD."),
    to: moment(to.toDate()).format("YYYY MMMM DD."),
    foodService: translateService(foodService),
    price: toPrice(price),
    calendarLink: parseCalendar(reservation),
    lastHandledBy: lastHandledBy || "Még senki",
    timestamp: moment(timestamp.toDate()).format("LLL")
  })
}

const parseCalendar = ({from, to, id, roomId, message, adults, children}) => generateURL({
  start: from.toDate(),
  end: to.toDate(),
  title: "Foglalás (Bíbic vendégházak)",
  location: "Nagybajom, Bibic vendégházak, Iskola köz, Hungary",
  details: `
Foglalás azonosító: ${id}

Szobaszám: ${roomId}
Megjegyzés: ${message}
Felnőtt: ${adults}
${children.map(({name, count})=> `Gyerek ${name}: ${count}`).join("\n")}

${constants.TEL}

${constants.ADMIN_EMAIL}
  `
})





export const commonFields = reservation => {
  const {
    tel, address, roomId, from, to, adults, children, message, price, foodService, id
  } = parseReservation(reservation)

  const getChildren = children =>
    children.map(({name, count}) => `Gyerekek ${name}: ${count}`)

  return `
Foglaló telefonszáma: ${tel}
Foglaló lakcíme: ${address}
Foglalni kívánt szoba száma: ${roomId}
Érkezés*: ${from}
Távozás*: ${to}
Felnőttek száma: ${adults}
${getChildren(children)}
Megjegyzés: ${message}
Ellátás: ${foodService}
Fizetendő összeg: ${price}

*Legkorábbi érkezés 14:00, legkorábbi távozás 10:00
`
}

