import {RESERVATIONS_FS} from "../../lib/firebase"
import {TODAY, TOMORROW} from "../../lib/moment"

export const reservation = {
  message: "🤖 admin által felvéve",
  name: "",
  roomId: 1,
  tel: "000-000-000",
  email: "email@email.hu",
  address: "lakcím",
  adults: 1,
  children: [
    {name: "0-6", count: 0},
    {name: "6-12", count: 0}
  ],
  from: TODAY.clone().hours(14).toDate(),
  to: TOMORROW.clone().hours(10).toDate(),
  handled: true,
  foodService: "breakfast",
  price: 1,
  archived: false
}


/**
 * Fetch a reservation.
 * @param {string} reservationId the id of the reservation to be fetched
 */
export async function fetchReservation(reservationId) {
  try {
    let reservation = await RESERVATIONS_FS.doc(reservationId || "non-existent").get()
    if (reservation.exists) {
      reservation = reservation.data()
      const {from, to} = reservation
      this.setState({
        reservationId,
        reservation: {
          ...reservation,
          from: from.toDate(),
          to: to.toDate()
        }
      })
    }
  } catch (error) {
    this.handleSendNotification(error)
  }
}

/**
 * Update the reservation that is under editing.
 * (Either creating, or editing one.)
 * @param {string} name name of the field
 * @param {object} value value of the field
 */
export function updateReservation(name, value) {
  this.setState(({reservation}) => ({reservation: {...reservation, [name]: value}}))
}

/**
 * Fetch how many unhandled reservations there are.
 */
export function fetchReservationCount() {
  try {
    RESERVATIONS_FS.where("handled", "==", false)
      .onSnapshot(snap =>
        this.setState({unhandledReservationCount: snap.size})
      )
  } catch (error) {
    this.handleSendNotification(error)
  }
}