const functions = require("firebase-functions")
const admin = require("firebase-admin")
admin.initializeApp()
admin.firestore().settings({timestampsInSnapshots: true})


// ---------------------------------------------------------------------------------------------------
// Imports from lib 📘
const overlaps = require("./lib/reservations/overlaps")
const reservations = require("./lib/reservations")
const email = require("./lib/email")
const prices = require("./lib/prices")
const pictures = require("./lib/pictures")



// Reservation handling 🔖
exports.reservationCreated = reservations.reservationCreated
exports.reservationChanged = reservations.reservationChanged
exports.reservationDeleted = reservations.reservationDeleted

exports.reservationExists = functions.region("europe-west1").https
  .onRequest(reservations.exists)

// Return overlaps in a month 📅
exports.getOverlaps = functions.region("europe-west1").https
  .onRequest(overlaps.getOverlaps)


// REVIEW: Messages moved to Firestore
exports.messageIncoming = functions.region("europe-west1").database
  .ref("messages/{messageId}")
  .onCreate(email.sendMessageEmails)


// Room handling 🏘
exports.populatePrices = functions.region("europe-west1").database
  .ref("rooms/{roomId}/prices/metadata")
  .onUpdate(prices.populatePrices)



// Picture handling 🍱
exports.generateThumbnail = functions.region("europe-west1").storage.object()
  .onFinalize(pictures.generateThumbnail)



exports.deletePicture = functions.region("europe-west1").database
  .ref("galleries/{galleryId}/{pictureId}")
  .onDelete(pictures.deletePicture)