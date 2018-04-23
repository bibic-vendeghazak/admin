const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()

// ---------------------------------------------------------------------------------------------------
// Imports from lib
const moment = require("./lib/moment")
const overlaps = require('./lib/overlaps')
const email = require("./lib/email")
const prices = require("./lib/prices")

// ---------------------------------------------------------------------------------------------------
// Database refs
const roomsRef = admin.database().ref("rooms")
const reservationDatesRef = admin.database().ref("reservationDates")

// ---------------------------------------------------------------------------------------------------
// Firestore refs
const reservationRef = functions.firestore
                          .document("reservations/{reservationId}")



// ---------------------------------------------------------------------------------------------------
// Helper functions

const updateReservationDates = (from, to, roomId, value=null) => {
  reservationPeriod = moment.range(from, to)
  for (let day of reservationPeriod.by('day')) {
    reservationDatesRef
      .child(`${day.format("YYYY/MM/DD")}/r${roomId}`)
      .set(value)
  }
}

const isEquivalent = (a, b) => {
  const keys = Object.keys(a)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (a[key] !== b[key]) {
      return false
    }
  }
  return true
}


// ---------------------------------------------------------------------------------------------------
// Reservation handling

exports.reservationCreated = reservationRef.onCreate((snap, {params: {reservationId}}) => {
  console.log("New reservation");
  return email.reservationCreated(reservationId, snap.data())
})


exports.reservationDeleted = reservationRef.onDelete((change, context) => {
  const {email, from, to, name, roomId} = change.data()
  updateReservationDates(from, to, roomId)
  return email.reservationRejected(email, name, true)
})


exports.reservationChanged = reservationRef.onUpdate(({before, after}, {params: {reservationId}}) => {
  before = before.data()
  after = after.data()

  // 🔥 Remove old dates
  updateReservationDates(before.from, before.to, before.roomId)
  // ✨ Add new dates
  updateReservationDates(after.from, after.to, after.roomId, after.handled ? reservationId : null)
  
  // Reservation accepted 🎉
  if (!before.handled && after.handled) {
    return email.reservationAccepted(reservationId, after)
  }

  // Reservation rejected ❌
  if (!after.handled) {
    return email.reservationRejected(after.email, after.name)
  }

  // Reservation changed 🔔
  if (!isEquivalent(before, after)) {
    return email.reservationChanged(before, after)
  }
  return null
})

    
// Return overlaps in a month
exports.overlaps = functions.https
  .onRequest((req, res) => {
    res.header('Access-Control-Allow-Origin', '*')
    return overlaps.overlaps(req, res)
  })


// ---------------------------------------------------------------------------------------------------
// Room handling
exports.populatePrices = functions.database
  .ref("rooms/{roomId}/prices/metadata")
  .onUpdate((change, context) => {
    const {roomId} = context.params
    const {maxPeople} = change.after.val()
    const priceTableRef = roomsRef.child(`${roomId}/prices/table`)
    const priceTypes = ["breakfast", "halfBoard"]
    const promises = priceTypes.map(priceType => 
        priceTableRef
          .child(priceType)
          .once("value", snap => snap.val())
      )
    return Promise
      .all(promises)
      .then(values => {
        return priceTableRef.set({
          "breakfast": prices.generatePrices(values[0].val(), maxPeople),
          "halfBoard": prices.generatePrices(values[1].val(), maxPeople)
        })
      })
  })
