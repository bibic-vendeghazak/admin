const constants = require("../constants")
const utils = require("./utils")
import { feedbackToHTML, reservationToHTML } from "./utils"

module.exports.adminText = reservation => {
  const {name, email, lastHandledBy, timestamp} = parse.parseReservation(reservation)
  return `
Név: ${name}
E-mail cím: ${email}
${parse.commonFields(reservation)}
Foglalást utoljára kezelte: ${lastHandledBy}"}
Utoljára módosítva: ${timestamp}
`
}

module.exports.createdUserText = ({name, ...reservation}) =>
  `
Tisztelt ${name}!

Foglalási kérelmét az alábbi információkkal megkaptuk:
${parse.commonFields(reservation)}

Mihamarabb értesítjük Önt a további teendőkről.
  
${constants.FOOTER}`

module.exports.acceptedUserText = ({name, lastHandledBy, ...reservation}) =>
  `
Tisztelt ${name}!

Foglalási kérelmét jóváhagytuk:
${parse.commonFields(reservation)}
A foglalást ${lastHandledBy} hagyta jóvá.

Köszönjük!
  
${constants.FOOTER}`

module.exports.changedUserText = ({name, lastHandledBy, ...reservation}) =>
  `
Tisztelt ${name}!

Foglalási kérelme módosult.
${parse.commonFields(reservation)}
A módosítást ${lastHandledBy} hagyta jóvá.

Köszönjük!
  
${constants.FOOTER}`
module.exports.changedFirstUserText = ({name, lastHandledBy, ...reservation}) =>
  `
Tisztelt ${name}!

Egyik adminunk felvett egy foglalást az Ön nevére.
${parse.commonFields(reservation)}
A foglalást ${lastHandledBy} hagyta jóvá.

Köszönjük!
  
${constants.FOOTER}`

module.exports.deletedUserText = ({name}) =>
  `
Tisztelt ${name}!

Foglalása törölve lett rendszerünkből.
Sajnáljuk.
  
${constants.FOOTER}`


module.exports.rejectedUserText = ({name, ...reservation}) =>
  `
Tisztelt ${name}!

Foglalása az alábbiak szerint módosul:
${parse.commonFields(reservation)}
  
${constants.FOOTER}`


module.exports.reservationHTML = (user, status, reservation) =>
  utils.reservationToHTML(`./templates/${user}/${status}.min.html`, reservation)


// SPECIAL REQUESTS / MESSAGES ---------------------------------------------------

module.exports.userMessage = ({name, tel, message, subject}) =>
  `
Tisztelt ${name}!

Üzenetét megkaptuk az alábbi adatokkal:
Téma: ${parse.translateSubject(subject)}
Telefonszám: ${tel}
Tartalom: ${message}

Amint tudunk, válaszolunk Önnek. Amennyiben további információt szeretne megadni, úgy válaszolhat erre az e-mailre.

${constants.FOOTER}
`

module.exports.adminMessage = ({name, email, tel, message, subject}) =>
  `
${name} új üzenetet küldött!
Téma: ${parse.translateSubject(subject)}
E-mail: ${email}
Telefonszám: ${tel}
Tartalom: ${message}
`



// Feedbacks -----------------



export const feedbackHTML = feedback =>
  feedbackToHTML("./templates/user/feedback.min.html", feedback)

