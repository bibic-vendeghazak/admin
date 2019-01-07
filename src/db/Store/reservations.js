import {RESERVATIONS_FS, TIMESTAMP} from "../../lib/firebase"
import moment, {TODAY, TOMORROW} from "../../lib/moment"
import {validateReservation} from "../../utils"

export const reservation = {
  message: "🤖 admin által felvéve",
  name: "",
  roomId: [1],
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

export const reservationsFilters = {
  from: TODAY.clone().add(-1, "week"),
  to: TODAY.clone().add(2, "months"),
  filteredRooms: [],
  query: [""]
}

/**
 * Fetch a reservation.
 * @param {string} reservationId the id of the reservation to be fetched
 */
export async function fetch(reservationId) {
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
 * @param {function} [callback]
 */
export function update(name, value, callback) {
  this.setState(({reservation}) => ({reservation: {...reservation, [name]: value}}), callback)
}

export function reset() {
  this.setState({reservation, reservationId: ""})
}

/**
 * Fetch how many unhandled reservations there are.
 */
export function fetchCount() {
  try {
    RESERVATIONS_FS.where("handled", "==", false)
      .onSnapshot(snap =>
        this.setState({unhandledReservationCount: snap.size})
      )
  } catch (error) {
    this.handleSendNotification(error)
  }
}

/**
 * Updates the reservation filter values
 * @param {string} name
 * @param {object} value
 */
export function changeFilter(name, value) {
  this.setState(({reservationsFilters}) => ({
    reservationsFilters: {
      ...reservationsFilters,
      [name]: value
    }
  }))
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
      id: `${moment(from).format("YYYYMMDD")}-sz${roomId.join("-")}`,
      lastHandledBy: adminName
    }

    const error = validateReservation({...updatedReservation, roomLength})

    console.log(updatedReservation)
    
    if (error) {
      return Promise.reject({code: "error", message: error})
    } else if (reservationId) {
      await RESERVATIONS_FS.doc(reservationId).set(updatedReservation)
    } else {
      await RESERVATIONS_FS.add(updatedReservation)
    }

    return Promise.resolve(true)

  } catch(error) {
    console.log(error)

    return await Promise.reject(error)
  }
}