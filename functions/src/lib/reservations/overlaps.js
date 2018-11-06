const admin = require("firebase-admin")
const moment = require("../moment")
const RESERVATIONS_FS = admin.firestore().collection("reservations")


module.exports.getOverlaps = ({query: {roomId}}, res) => {
  // NOTE: Change origin to bibicvendeghazak.hu
  res.header("Access-Control-Allow-Origin", "*")
  return RESERVATIONS_FS
    .where("roomId", "==", parseInt(roomId, 10))
    .where("to", ">=", moment().startOf("day").add(-1, "week").toDate())
    .get()
    .then(snap => {
      const overlaps = []
      if (!snap.empty) {
        snap.forEach(reservation => {
          const {from, to} = reservation.data()
          overlaps.push(moment.range(moment(from.toDate()), moment(to.toDate())))
        })
      }
      return res.send(JSON.stringify(overlaps))
    })
}

