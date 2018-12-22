import {TODAY} from "../constants"
import {subDays } from "date-fns"
import { RESERVATIONS_FS, ROOMS_DB } from "../firebase"

/**
 * Return overlaps for a room
 */
export const getOverlaps = ({query: {roomId}}, res) => {
  // NOTE: Change origin to bibicvendeghazak.hu
  res.header("Access-Control-Allow-Origin", "*")
  const overlaps = []
  return Promise.all([
    ROOMS_DB.child(`${roomId - 1}/unavailable`).once("value"),
    RESERVATIONS_FS
      .where("roomId", "==", parseInt(roomId, 10))
      .where("to", ">=", subDays(TODAY, 1))
      .get()
  ]).then(([unavailable, reservations]) => {
    if (unavailable.exists()) {
      overlaps.push({start: TODAY, end: new Date(unavailable.val())})
    }
    if (!reservations.empty) {
      reservations.forEach(reservation => {
        const {from, to} = reservation.data()
        overlaps.push({start: from.toDate(), end: to.toDate()})
      })
    }
    return res.send(JSON.stringify(overlaps))
  })

}

