import {validateReservation} from "../../utils"
import {moment} from "../../lib"
import {RESERVATIONS_FS, TIMESTAMP} from "../../lib/firebase"

export const getPrice = ({
  from, to, roomId, adults, children, foodService
}, rooms) => {

  let price = 0
  let error = {code: "WRONG_PRICE_TABLE", message: "Hibás ártáblázat"}

  try {
    const {prices} = rooms[roomId-1]
    const {maxPeople} = prices.metadata
    const priceTable = prices.table[foodService]

    if (!priceTable || typeof maxPeople !== "number") return

    error = {code: "CUSTOM_PRICING_NEEDED", message: "Egyedi árazás szükséges"}
    // Check if there is enough place for the amount of adults
    const tempPrice = priceTable[adults]

    const freeChildCount = children[0].count
    const childCount = children[1].count

    // Check if there is enough place including the children
    if ((adults + freeChildCount + childCount) <= maxPeople) {

      const periodLength = moment.range(from, to).snapTo("day").diff("day")

      price = tempPrice[childCount].price * periodLength
      error = null

      if (periodLength <= 0)
        error = {code: "INVALID_PRICE", message: "Érvénytelen ár (az érkezés/távozás jól lett kitöltve?)"}

    }

  } finally {
    return ({error, price})
  }

}

/**
 * Submits the reservation (either edit or create)
 * @param {object} reservation The reservation to be submitted
 * @param {number} roomLength Number of rooms in the database.
 * @param {string} adminName Name of the logged in admin.
 * @param {string} [reservationId] the id of the reservation, if edited, not created.
 */
export async function handleSubmit(reservation, roomLength, adminName, reservationId){
  try {
    const {from, roomId, ...rest} = reservation

    const updatedReservation = {
      ...rest,
      timestamp: TIMESTAMP,
      from,
      roomId,
      id: `${moment(from).format("YYYYMMDD")}-sz${roomId}`,
      lastHandledBy: adminName
    }

    const error = validateReservation({...updatedReservation, roomLength})

    let result
    if (error) {
      result = Promise.reject({code: "error", message: error})
    } else if (reservationId) {
      result = RESERVATIONS_FS.doc(reservationId).set(updatedReservation)
    } else {
      result = RESERVATIONS_FS.add(updatedReservation)
    }

    return await result

  } catch(error) {
    return await Promise.reject(error)
  }

}