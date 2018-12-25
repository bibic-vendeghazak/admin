import {validateReservation} from "../../utils"
import {RESERVATIONS_FS, TIMESTAMP} from "../../lib/firebase"
import {moment} from "../../lib"


export const getPrice = ({
  from, to, roomId, adults, children, foodService
}, rooms) => {
  let price = 0
  let error
  if (rooms.length) {
    const roomPrice = rooms[roomId-1].prices.table[foodService]

    error = "Egyedi árazás szükséges"
    if(roomPrice.hasOwnProperty(adults)) {
      const periodLength = moment(to).diff(moment(from), "days") + 1
      const tempPrice = roomPrice[adults]
      const childCount = children[1] ? children[1].count : 0
      if(tempPrice.hasOwnProperty(childCount)) {
        price = tempPrice[childCount].price * periodLength
        error = null
      }
    }

  }
  return ({error, price})
}


export const handleSubmit = (reservation, roomLength, adminName, reservationId) => {
  reservation.from = reservation.from.toDate()
  reservation.to = reservation.to.toDate()
  reservation.timestamp = TIMESTAMP
  reservation.id = `${moment(reservation.from).format("YYYYMMDD")}-sz${reservation.roomId}`
  reservation.lastHandledBy = adminName
  reservation.archived = false

  const error = validateReservation({...reservation, roomLength})

  return !error ?
    reservationId ?
      RESERVATIONS_FS.doc(reservationId).set(reservation) :
      RESERVATIONS_FS.add(reservation) :
    Promise.reject({code: "error", message: error})
}