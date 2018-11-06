const admin = require("firebase-admin")
const RESERVATIONS_FS = admin.firestore().collection("reservations")

module.exports.reservationExists = ({query: {id, customId}}, response) => {
  // NOTE: Change origin to bibicvendeghazak.hu
  response.header("Access-Control-Allow-Origin", "*")
  return RESERVATIONS_FS.doc(id).get().then(reservation =>
    response.send(
      JSON.stringify(reservation.exists && reservation.data().id === customId)
    )
  )
}

