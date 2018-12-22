import { FOOTER } from "../constants"
import { commonFields, parseReservation, translateSubject } from "./parse"
import { feedbackToHTML, reservationToHTML } from "./utils"

export const adminText = reservation => {
  const {name, email, lastHandledBy, timestamp} = parseReservation(reservation)
  return `
Név: ${name}
E-mail cím: ${email}
${commonFields(reservation)}
Foglalást utoljára kezelte: ${lastHandledBy}"}
Utoljára módosítva: ${timestamp}
`
}

export const createdUserText = ({name, ...reservation}) =>
  `
Tisztelt ${name}!

Foglalási kérelmét az alábbi információkkal megkaptuk:
${commonFields(reservation)}

Mihamarabb értesítjük Önt a további teendőkről.
  
${FOOTER}`

export const acceptedUserText = ({name, lastHandledBy, ...reservation}) =>
  `
Tisztelt ${name}!

Foglalási kérelmét jóváhagytuk:
${commonFields(reservation)}
A foglalást ${lastHandledBy} hagyta jóvá.

Köszönjük!
  
${FOOTER}`

export const changedUserText = ({name, lastHandledBy, ...reservation}) =>
  `
Tisztelt ${name}!

Foglalási kérelme módosult.
${commonFields(reservation)}
A módosítást ${lastHandledBy} hagyta jóvá.

Köszönjük!
  
${FOOTER}`
export const changedFirstUserText = ({name, lastHandledBy, ...reservation}) =>
  `
Tisztelt ${name}!

Egyik adminunk felvett egy foglalást az Ön nevére.
${commonFields(reservation)}
A foglalást ${lastHandledBy} hagyta jóvá.

Köszönjük!
  
${FOOTER}`

export const deletedUserText = ({name}) =>
  `
Tisztelt ${name}!

Foglalása törölve lett rendszerünkből.
Sajnáljuk.
  
${FOOTER}`


export const rejectedUserText = ({name, ...reservation}) =>
  `
Tisztelt ${name}!

Foglalása az alábbiak szerint módosul:
${commonFields(reservation)}
  
${FOOTER}`


export const reservationHTML = async (user, status, reservation) =>
  await reservationToHTML(`./templates/${user}/${status}.min.html`, reservation)


// SPECIAL REQUESTS / MESSAGES ---------------------------------------------------

export const userMessage = ({name, tel, content, subject}) =>
  `
Tisztelt ${name}!

Üzenetét megkaptuk az alábbi adatokkal:
Téma: ${translateSubject(subject)}
Telefonszám: ${tel}
Tartalom:
${content}

Amint tudunk, válaszolunk Önnek. Amennyiben további információt szeretne megadni, úgy válaszolhat erre az e-mailre.

${FOOTER}
`

export const adminMessage = ({name, email, tel, content, subject}) =>
  `
${name} új üzenetet küldött!
Téma: ${translateSubject(subject)}
E-mail: ${email}
Telefonszám: ${tel}
Tartalom:
${content}
`



// Feedbacks -----------------



export const feedbackHTML = feedback =>
  feedbackToHTML("./templates/user/feedback.min.html", feedback)

