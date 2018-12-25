import {validateReservation} from "../../utils"
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


export const handleSubmit = async (
  {from, to, roomId, ...rest},
  roomLength, adminName, reservationId
) => {
  try {
    const {RESERVATIONS_FS, TIMESTAMP} = await import("../../lib/firebase")

    const updatedReservation = {
      ...rest,
      from: from.toDate(),
      to: to.toDate(),
      timestamp: TIMESTAMP,
      id: `${moment(from).format("YYYYMMDD")}-sz${roomId}`,
      lastHandledBy: adminName,
      archived: false
    }

    const error = validateReservation({...updatedReservation, roomLength})

    let result = RESERVATIONS_FS.add(updatedReservation)

    if (reservationId)
      result = RESERVATIONS_FS.doc(reservationId).set(updatedReservation)

    return error ? Promise.reject({code: "error", message: error}) : result

  } catch (error) {
    return Promise.reject(error)
  }
}