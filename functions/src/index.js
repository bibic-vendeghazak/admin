const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()

// ---------------------------------------------------------------------------------------------------
// Imports from lib 📘
const overlaps = require('./lib/reservations/overlaps')
const reservations = require('./lib/reservations')
const email = require("./lib/email")
const prices = require("./lib/prices")
const pictures = require("./lib/pictures")



// Reservation handling 🔖
exports.reservationCreated = reservations.reservationCreated
exports.reservationChanged = reservations.reservationChanged
exports.reservationDeleted = reservations.reservationDeleted


// Return overlaps in a month 📅
exports.overlaps = functions.region('europe-west1').https
  .onRequest(overlaps.overlaps)



exports.messageIncoming = functions.region('europe-west1').database
  .ref("messages/{messageId}")
  .onCreate(email.sendMessageEmails)


// Room handling 🏘
exports.populatePrices = functions.region('europe-west1').database
  .ref("rooms/{roomId}/prices/metadata")
  .onUpdate(prices.populatePrices)



// Picture handling 🍱
exports.generateThumbnail = functions.region('europe-west1').storage.object()
  .onFinalize(pictures.generateThumbnail)



exports.deletePicture = functions.region('europe-west1').database
  .ref("galleries/{galleryId}/{pictureId}")
  .onDelete(pictures.deletePicture)