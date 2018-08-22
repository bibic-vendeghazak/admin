const moment = require("./moment")
const generateURL = require("generate-google-calendar-url")
const constants = require("./constants")

const toPrice = price => parseInt(price, 10)
  .toLocaleString("hu-HU", {
    style: "currency",
    currency: "HUF",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  })

const translateSubject = subject => {
  switch (subject) {
  case "other":
    subject = "Egyéb"
    break
  case "eventHall":
    subject = "Rendezvényterem"
    break
  case "special":
    subject = "Külön ajánlat"
    break
  case "fullHouse":
    subject = "Teljes ház"
    break
  }
  return subject
}

const translateService = service => {
  switch (service) {
  case "halfBoard":
    service = "Félpanzió"
    break
  case "breakfast":
    service = "Reggeli"
    break
  }
  return service
}

module.exports.userMessage = ({name, tel, message, subject}) =>
  `
Tisztelt ${name}!

Üzenetét megkaptuk az alábbi adatokkal:
Téma: ${translateSubject(subject)}
Telefonszám: ${tel}
Tartalom: ${message}

Amint tudunk, válaszolunk Önnek. Amennyiben további információt szeretne megadni, úgy válaszolhat erre az e-mailre.

${constants.FOOTER}
`

module.exports.adminMessage = ({name, email, tel, message, subject}) =>
  `
${name} új üzenetet küldött!
Téma: ${translateSubject(subject)}
E-mail: ${email}
Telefonszám: ${tel}
Tartalom: ${message}
`

const getChildren = children =>
  children.map(({name, count}) => `
Gyerekek ${name}: ${count}`)

const commonFields = ({
  tel, address, roomId, from, to, adults, children, message, price, activeService, id
}) =>`
Foglaló telefonszáma: ${tel}
Foglaló lakcíme: ${address}
Foglalni kívánt szoba száma: ${roomId}
Érkezés: ${moment(from.toDate()).format("LLL")}
Távozás: ${moment(to.toDate()).format("LLL")}
Felnőttek száma: ${adults}${getChildren(children)}
Megjegyzés: ${message}
Ellátás: ${translateService(activeService)}
Fizetendő összeg: ${toPrice(price)}
Foglalási azonosító: ${id}
`


module.exports.adminText = reservation =>
  `
Név: ${reservation.name}
E-mail cím: ${reservation.email}
${commonFields(reservation)}
Foglalást utoljára kezelte: ${reservation.lastHandledBy || "Még senki"}
Utoljára módosítva: ${moment(reservation.timestamp).format("LLL")}
`

module.exports.adminHTML = ({tel, address, roomId, from, to, adults, children, message, activeService, price, name, email, reservationId, lastHandledBy, timestamp}) =>
  `
<ul style="list-style-type:none">
  <li>Név: ${name}</li></li>
  <li>E-mail cím: ${email}</li>
  <li>Telefonszám: ${tel}</li>
  <li>Lakcím: ${address}</li>
  <li><a href="${constants.ADMIN_ROOT}/foglalasok/${reservationId}">Ugrás a foglalásra</a></li>
  <li>Szoba száma: ${roomId}</li>
  <li>Érkezés: ${moment(from.toDate()).format("LLL")}</li>
  <li>Távozás: ${moment(to.toDate()).format("LLL")}</li>
  <li>Felnőttek száma: ${adults}</li>
  <li>Gyerekek (0-6): ${children[0].count}</li>
  <li>Gyerekek (6-12): ${children[1].count}</li>
  <li>Megjegyzés: ${message}</li>
  <li>Ellátás: ${translateService(activeService)}</li>
  <li>Fizetendő összeg: ${toPrice(price)}</li>
  <li>Foglalási azonosító: ${reservationId} </li>
  <li>Foglalást utoljára kezelte: ${lastHandledBy || "Még senki"}</li>
  <li>Utoljára módosítva: ${moment(timestamp.toDate()).format("LLL")}</li>
</ul>
`

module.exports.createdUserText = reservation =>
  `
Tisztelt ${reservation.name}!

Foglalási kérelmét megkaptuk, az alábbi információkkal:
${commonFields(reservation)}
Foglalási azonosító: ${reservation.reservationId}

Mihamarabb értesítjük Önt a további teendőkről.
  
${constants.FOOTER}`

module.exports.acceptedUserText = reservation =>
  `
Tisztelt ${reservation.name}!

Foglalási kérelmét jóváhagytuk:
${commonFields(reservation)}
A foglalást ${reservation.lastHandledBy} hagyta jóvá.

Köszönjük!
  
${constants.FOOTER}`

module.exports.changedUserText = reservation =>
  `
Tisztelt ${reservation.name}!

Foglalási kérelme módosult.
${commonFields(reservation)}
A módosítást ${reservation.lastHandledBy} hagyta jóvá.

Köszönjük!
  
${constants.FOOTER}`
module.exports.changedFirstUserText = reservation =>
  `
Tisztelt ${reservation.name}!

Egyik adminunk felvett egy foglalást az Ön nevére.
${commonFields(reservation)}
A foglalást ${reservation.lastHandledBy} hagyta jóvá.

Köszönjük!
  
${constants.FOOTER}`

module.exports.deletedUserText = ({name}) =>
  `
Tisztelt ${name}!

Foglalása törölve lett rendszerünkből.
Sajnáljuk.
  
${constants.FOOTER}`


module.exports.rejectedUserText = reservation =>
  `
Tisztelt ${reservation.name}!

Foglalása az alábbiak szerint módosul:
${commonFields(reservation)}
  
${constants.FOOTER}`





module.exports.acceptedHTML = ({address, reservationId, id, name, from, to, tel, message, roomId, adults, children, price, activeService, lastHandledBy}) => {

  message = message !== "" ? message : "-"
  price = toPrice(price)
  const calendarLink = generateURL({
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


  return `<!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head> <title></title> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> <meta name="viewport" content="width=device-width,initial-scale=1"> <style type="text/css"> #outlook a, body{padding: 0}.ExternalClass *, img{line-height: 100%}.ExternalClass, .ReadMsgBody{width: 100%}body{margin: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%}table, td{border-collapse: collapse; mso-table-lspace: 0; mso-table-rspace: 0}img{border: 0; height: auto; outline: 0; text-decoration: none; -ms-interpolation-mode: bicubic}p{display: block; margin: 13px 0}</style> <style type="text/css"> @media only screen and (max-width:480px){@-ms-viewport{width: 320px}@viewport{width: 320px}}</style> <link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700" rel="stylesheet" type="text/css"> <style type="text/css"> @import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700); </style> <style type="text/css"> @media only screen and (min-width:480px){.mj-column-per-100{width: 100% !important}}</style></head><body style="background:#FFF"> <div itemscope itemtype="http://schema.org/LodgingReservation"> <meta itemprop="reservationNumber" content="${reservationId}"> <link itemprop="reservationStatus" href="http://schema.org/Confirmed"> <div itemprop="underName" itemscope itemtype="http://schema.org/Person"> <meta itemprop="name" content="${name}"> </div><div itemprop="reservationFor" itemscope itemtype="http://schema.org/LodgingBusiness"> <meta itemprop="name" content="Bíbic vendégházak"> <div itemprop="address" itemscope itemtype="http://schema.org/PostalAddress"> <meta itemprop="streetAddress" content="Iskola köz"> <meta itemprop="addressLocality" content="Nagybajom"> <meta itemprop="addressRegion" content="HU"> <meta itemprop="postalCode" content="7561"> <meta itemprop="addressCountry" content="HU"> </div><meta itemprop="telephone" content="+36 30 433 6698"> </div><meta itemprop="checkinDate" content=">${moment(from.toDate()).format(" LLL ")}"> <meta itemprop="checkoutDate" content=">${moment(to.toDate()).format(" LLL ")}"> </div><div class="mj-container" style="background-color:#FFF"> <table role="presentation" cellpadding="0" cellspacing="0" style="background:url(https://topolio.s3-eu-west-1.amazonaws.com/uploads/5ace578cb3982/1523475292.jpg) top center #1F1511;font-size:0;width:100%" border="0" background="https://topolio.s3-eu-west-1.amazonaws.com/uploads/5ace578cb3982/1523475292.jpg"> <tbody> <tr> <td> <div style="margin:0 auto;max-width:600px"> <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0;width:100%" align="center" border="0"> <tbody> <tr> <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0;padding:9px 0"> <div class="mj-column-per-100 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%"> <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td style="word-wrap:break-word;font-size:0"> <div style="font-size:1px;line-height:24px;white-space:nowrap">&#xA0;</div></td></tr><tr> <td style="word-wrap:break-word;font-size:0;padding:8px 20px" align="center"> <div style="cursor:auto;color:#FFF;font-family:Helvetica,sans-serif;font-size:11px;line-height:22px;text-align:center"> <h1 style="font-family:Cabin,sans-serif;color:#FFF;font-size:32px;line-height:.1">Foglalás rögzítve</h1> </div></td></tr><tr> <td style="word-wrap:break-word;font-size:0;padding:10px 25px 0px 25px" align="center"> </td></tr></tbody> </table> </div></td></tr></tbody> </table> </div></td></tr></tbody> </table> <div style="margin:0 auto;max-width:600px"> <table role="presentation" cellpadding="0" cellspacing="0" style="font-size:0;width:100%" align="center" border="0"> <tbody> <tr> <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0;padding:9px 0"> <div class="mj-column-per-100 outlook-group-fix" style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%"> <table role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0"> <tbody> <tr> <td style="word-wrap:break-word;font-size:0;padding:0 20px" align="left"> <div style="cursor:auto;color:#000;font-family:Ubuntu,Helvetica,Arial,sans-serif;font-size:11px;line-height:22px;text-align:left"> <table align="center" border="0" cellpadding="1" cellspacing="1" style="max-width:500px;width:100%"> <thead> <tr> <th scope="col"> <h3 style="line-height:100%"> <strong>Foglal&#xF3; adatai</strong> </h3> </th> <th scope="col"></th> </tr></thead> <tbody> <tr> <td> <span style="font-size:14px">N&#xE9;v</span> </td><td style="text-align:right"> <span style="font-size:14px">${name}</span> </td></tr><tr> <td> <span style="font-size:14px">Telefonsz&#xE1;m</span> </td><td style="text-align:right"> <span style="font-size:14px">${tel}</span> </td></tr><tr> <td> <span style="font-size:14px">Lakcím</span> </td><td style="text-align:right"> <span style="font-size:14px">${address}</span> </td></tr><tr> <td> <span style="font-size:14px">Szobaszám</span> </td><td style="text-align:right"> <span style="font-size:14px">${roomId}</span> </td></tr><tr> <td> <span style="font-size:14px">Felnőtt</span> </td><td style="text-align:right"> <span style="font-size:14px">${adults}fő</span> </td></tr>${children.map(({name, count})=>` <tr> <td> <span style="font-size:14px">${name} éves korig</span> </td><td style="text-align:right"> <span style="font-size:14px">${count}fő</span> </td></tr>`).join("")}<tr> <td> <span style="font-size:14px">Érkezés</span> </td><td style="text-align:right"> <span style="font-size:14px">${moment(from.toDate()).utcOffset(2).format("LLL")}</span> </td></tr><tr> <td> <span style="font-size:14px">T&#xE1;voz&#xE1;s</span> </td><td style="text-align:right"> <span style="font-size:14px">${moment(to.toDate()).utcOffset(2).format("LLL")}</span> </td></tr><tr> <td> <span style="font-size:14px">Megjegyz&#xE9;s</span> </td><td style="text-align:right"> <span style="font-size:14px">${message}</span> </td></tr><tr> <td> <span style="font-size:14px">Ellátás</span> </td><td style="text-align:right"> <span style="font-size:14px">${translateService(activeService)}</span> </td></tr><tr> <td> <span style="font-size:14px">Fizetendő összeg</span> </td><td style="text-align:right"> <span style="font-size:14px">${price}</span> </td></tr><tr> <p style="font-size:1px;margin:0 auto;border-top:1px dashed #ACACAC;width:100% "></p></tr><tr> <td> <span style="font-size:14px">Jóváhagyta</span> </td><td style="text-align:right"> <span style="font-size:14px">${lastHandledBy}</span> </td></tr><tr> <td> <span style="font-size:14px">Azonosító</span> </td><td style="text-align:right"> <span style="font-size:14px">${id}</span> </td></tr><tr> <td> <table role="presentation" cellpadding="0" cellspacing="0" border="0"> <tbody> <tr> <td style="border:none;border-radius:none;color:#fff;cursor:auto;padding:10px 25px" bgcolor="#b35d41"> <a href="${calendarLink}" style="text-decoration:none;background:#b35d41;color:#fff;font-family:Ubuntu,Helvetica,Arial,sans-serif,Helvetica,Arial,sans-serif;font-size:13px;font-weight:400;line-height:120%;text-transform:none;margin:0" target="_blank">Hozzáadás a Google Naptárhoz</a> </td></tr></tbody> </table> </td><td style="padding-top:36px;text-align:right"> <img src="cid:qr-code-123" alt="QR-kód " width="160"> </td></tr></tbody> </table> <p></p></div></td></tr></tbody> </table> </div></td></tr></tbody> </table> </div><div style="margin:0 auto;max-width:600px "> <table role="presentation " cellpadding="0 " cellspacing="0 " style="font-size:0;width:100% " align="center " border="0 "> <tbody> <tr> <td style="text-align:center;vertical-align:top;direction:ltr;font-size:0;padding:9px 0 "> <div class="mj-column-per-100 outlook-group-fix " style="vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100% "> <table role="presentation " cellpadding="0 " cellspacing="0 " width="100% " border="0 "> <tbody> <tr> <td style="word-wrap:break-word;font-size:0;padding:20px 22px "> <p style="font-size:1px;margin:0 auto;border-top:1px dashed #ACACAC;width:100% "></p></td></tr><tr> <td style="word-wrap:break-word;font-size:0;padding:10px 25px " align="center "> <div> <table role="presentation " cellpadding="0 " cellspacing="0 " style="float:none;display:inline-table " align="center " border="0 "> <tbody> <tr> <td style="padding:4px;vertical-align:middle "> <table role="presentation " cellpadding="0 " cellspacing="0 " style="background:0 0;border-radius:3px;width:35px " border="0 "> <tbody> <tr> <td style="vertical-align:middle;width:35px;height:35px "> <a href="https://www.facebook.com/B%C3%ADbic-Vend%C3%A9gh%C3%A1zak-200199203718517 "> <img alt="facebook " height="35 " src="https://s3-eu-west-1.amazonaws.com/ecomail-assets/editor/social-icos/rounded/facebook.png " style="display:block;border-radius:3px " width="35 "> </a> </td></tr></tbody> </table> </td><td style="padding:4px 4px 4px 0;vertical-align:middle "> <a href="https://www.facebook.com/B%C3%ADbic-Vend%C3%A9gh%C3%A1zak-200199203718517 " style="text-decoration:none;text-align:left;display:block;color:#333;font-family:Ubuntu,Helvetica,Arial,sans-serif;font-size:13px;line-height:22px;border-radius:3px "></a> </td></tr></tbody> </table> </div></td></tr><tr> <td style="word-wrap:break-word;font-size:0;padding:20px 22px 10px 25px "> <p style="font-size:1px;margin:0 auto;border-top:1px dashed #ACACAC;width:100% "></p></td></tr><tr> <td style="word-wrap:break-word;font-size:0;padding:0 20px " align="center "> <div style="cursor:auto;color:#000;font-family:Ubuntu,Helvetica,Arial,sans-serif;font-size:11px;line-height:22px;text-align:center "> <a href="https://bibicvendeghazak.hu">B&#xED;bic vend&#xE9;gh&#xE1;zak</a> <p>Nagybajom, Iskola k&#xF6;z, 7561 Magyarorsz&#xE1;g</a> <p> <a href="tel:36304336698 ">+36 30 433 6698</p></p></div></td></tr></tbody> </table> </div></td></tr></tbody> </table> </div></div></body></html>`
}