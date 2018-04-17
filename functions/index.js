const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()

// Imports from lib
const overlaps = require('./lib/overlaps')
const emailTemplate = require("./lib/email")

// Init Firebase

// Database refs
const roomsRef = admin.database().ref("rooms")
const reservationsRef = admin.database().ref("reservations")
const reservationRef = functions.database.ref('reservations/{reservationId}')


exports.reservationCreated = reservationRef.onCreate((snap, context) => {
  const {email, name, tel, from, to, roomId, message} = snap.val()
  const reservation = {name, tel, from, to, roomId, message}
  const {reservationId} = context.params
  console.log("New reservation!");
  return emailTemplate.reservationRecieved(reservationId, email, reservation)
})

exports.reservationDeleted = reservationRef.onDelete((snap, context) => {
  const {email: to, name} = snap.val()
  console.log("Delete reservation, sending email...")
  return emailTemplate.reservationRejected(to, name, "töröltük")
})

exports.reservationChanged = reservationRef.onUpdate((change, context) => {
  const {
          handled: handledBefore,
          name: oldName,
          tel: oldTel,
          from: oldFrom,
          to: oldTo,
          adults: oldAdults,
          children: oldChildren,
          message: oldMessage,
          roomId: oldRoomId,
          lastHandledBy: lastHandledByBefore
        } = change.before.val()
  const {
          handled: handledAfter,
          email,
          name, tel, from, to, adults, children, roomId, message
        } = change.after.val()
  const oldReservation = {
    name: oldName,
    tel: oldTel,
    from: oldFrom,
    to: oldTo,
    adults: oldAdults,
    children: oldChildren,
    message: oldMessage,
    roomId: oldRoomId
  }
  const {reservationId} = context.params
  const reservation = {name, tel, from, to, adults, children, roomId, message}
  
  if (!handledBefore && handledAfter && lastHandledByBefore === "") {
    console.log("Reservation accepted, sending email...")
    return emailTemplate.reservationAccepted(reservationId, email, reservation)
  }
  if (!handledAfter && lastHandledByBefore !== "") {
    console.log("Reservation rejected, sending email...")
    return emailTemplate.reservationRejected(email, oldName, "elutasítottuk")
  }

  if(oldReservation !== reservation) {
    console.log("Reservation details changed, sending email...")
    return emailTemplate.reservationChanged(email, reservation)
  }

  return null
})
    
exports.getOverlaps = functions.https
  .onRequest((req, res) => {
    res.header('Access-Control-Allow-Origin', '*')
    return overlaps.getOverlaps(req, res)}
  )


exports.populatePrices = functions.database
    .ref("rooms/{roomId}/prices/metadata")
    .onUpdate((change, context) => {
        const {roomId} = contect.params
        const {maxPeople} = change.after.val()
        const priceTableRef = roomsRef.child(`${roomId}/prices/table`)
        const priceTypes = ["breakfast", "halfBoard"]
        const promises = priceTypes.map(priceType => (
                priceTableRef.child(priceType).once("value", snap => snap.val())
            ))
        return Promise
            .all(promises)
            .then(values => {
                return priceTableRef.set({
                    "breakfast": prices.generatePrices(values[0].val(), maxPeople),
                    "halfBoard": prices.generatePrices(values[1].val(), maxPeople)
                })

            })
    })
