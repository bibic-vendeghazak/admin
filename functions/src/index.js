const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()

// ---------------------------------------------------------------------------------------------------
// Imports from lib 📘
const moment = require("./lib/moment")
const overlaps = require('./lib/overlaps')
const email = require("./lib/email")
const prices = require("./lib/prices")
const pictures = require("./lib/pictures")

// ---------------------------------------------------------------------------------------------------
// Database refs 🏦
const reservationDatesRef = admin.database().ref("reservationDates")

// ---------------------------------------------------------------------------------------------------
// Firestore refs 🏦
const reservationRef = functions.region('europe-west1').firestore
                          .document("reservations/{reservationId}")



// ---------------------------------------------------------------------------------------------------
// Helper functions ♿

const updateReservationDates = (from, to, roomId, reservationId, shouldDelete=false) => {
  console.log("Updating reservation dates...")
  from = moment(from.toDate())
  to = moment(to.toDate())
  for (let day of moment.range(from, to.clone().add(1, "day")).by('day')) {
    let newReservation = null
    if (!shouldDelete) {
      newReservation = {
        from: day.isSame(from, "day"),
        to: day.isSame(to, "day")
      }
    }
    reservationDatesRef
      .child(`${day.clone().format("YYYY/MM/DD")}/r${roomId}/${reservationId}`)
      .set(newReservation)
  }
}

const isEquivalent = (a, b) => {
  const keys = Object.keys(a)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    if (a[key] !== b[key]) {
      return false
    }
  }
  return true
}


// ---------------------------------------------------------------------------------------------------
// Reservation handling 🔖
exports.reservationCreated = reservationRef.onCreate((snap, {params: {reservationId}}) => {
  const reservation = snap.data()
  const {from, to, roomId} = reservation

  updateReservationDates(from, to, roomId, snap.id)

  reservation.reservationId = reservationId

  return reservation.email !== "email@email.hu" ? email.sendReservationEmails(reservation, "created") : null
})

exports.messageIncoming = functions.region('europe-west1').database
  .ref("messages/{messageId}")
  .onCreate(email.sendMessageEmails)

exports.reservationChanged = reservationRef
  .onUpdate(({before, after}, {params: {reservationId}}) => {
    before = before.data()
    const reservation = after.data()

    // 🔥 Remove old dates
    updateReservationDates(before.from, before.to, before.roomId, reservationId, true)
    // ✨ Add new dates
    updateReservationDates(reservation.from, reservation.to, reservation.roomId, reservationId)

    if (reservation.email === "email@email.hu") {
      return null
    }

    const type =
    // Reservation accepted 🎉
    (!before.handled && reservation.handled) ? "accepted" :
    // Reservation changed 🔔
    (before.handled === reservation.handled && !isEquivalent(before, reservation)) ? "changed" : null


    reservation.reservationId = reservationId
    return type ? email.sendReservationEmails(reservation, type) : null
  })

  exports.reservationDeleted = reservationRef
  .onDelete((change, {params: {reservationId}}) => {
    const reservation = change.data()
    const {from, to, roomId} = reservation

    updateReservationDates(from, to, roomId, reservationId, true)

    reservation.reservationId = reservationId

    return reservation.email !== "email@email.hu" ? email.sendReservationEmails(reservation, "deleted") : null
})




// Return overlaps in a month 📅
exports.overlaps = functions.region('europe-west1').https
  .onRequest(overlaps.overlaps)



// ---------------------------------------------------------------------------------------------------
// Room handling 🏘
exports.populatePrices = functions.region('europe-west1').database
  .ref("rooms/{roomId}/prices/metadata")
  .onUpdate(prices.populatePrices)



// ---------------------------------------------------------------------------------------------------
// Picture handling 🍱
exports.generateThumbnail = functions.region('europe-west1').storage.object()
  .onFinalize(pictures.generateThumbnail)



exports.deletePicture = functions.region('europe-west1').database
  .ref("galleries/{galleryId}/{pictureId}")
  .onDelete(pictures.deletePicture)