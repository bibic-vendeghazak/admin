import {ROOMS_DB, RESERVATION_DATES_DB, ROOM_SERVICES_DB} from "../../lib/firebase"
import {TODAY} from "../../lib/moment"

export function subscribeToRooms() {
  ROOMS_DB.on("value", async snap => {
    const rooms = snap.val()
    const reservations = await RESERVATION_DATES_DB
      .child(TODAY.clone().format("YYYY/MM/DD"))
      .once("value", reservations => reservations)
    if (reservations.exists()) {
      reservations.forEach(() => {
        Object.keys(reservations.val())
          .map(key => key.substring(1))
          .forEach(roomId => {rooms[roomId-1].booked = true})
      })
    }
    this.setState({rooms})
  })
}


export function subscribeToRoomServices() {
  ROOM_SERVICES_DB.on("value", snap => {
    this.setState({roomServices: snap.val()})
  })
}