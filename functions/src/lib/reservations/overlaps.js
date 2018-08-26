const admin = require("firebase-admin")
const moment = require("../moment")

const reservationDatesRef = admin.database().ref("reservationDates")


/**
 * Checks a given month if a room is booked at that time
 * @param {array} date - ([2018,12]) month to check
 * @returns {JSON}
 */
const getMonth = date => {
  const nextMonth = moment(`${date.join("-")}-01`).add(1, "month")
  return Promise.all([
    reservationDatesRef
      .child(date.join("/"))
      .once("value").then(snap => {
        const month = {}
        snap.forEach(day => {
          month[`${date.join("-")}-${day.key}`] = day.val()
        })
        return month
      }),
    reservationDatesRef
      .child(nextMonth.clone().format("YYYY/MM"))
      .once("value").then(snap => {
        const month = {}
        snap.forEach(day => {
          month[`${nextMonth.clone().format("YYYY-MM")}-${day.key}`] = day.val()
        })
        return month
      })
  ]).then(([present, future]) => {
    return {...present, ...future}
  })
}


const isAvailable = (roomId, from, to) => (
  Promise.all(Array
    .from(moment
      .range(from, to)
      .by("day"))
    .map(day =>
      reservationDatesRef
        .child(`${day.clone().format("YYYY/MM/DD")}/${roomId}`)
        .once("value")
        .then(snap => {
          if (snap.exists()) {
            return snap.forEach(reservation => {
              const isBefore = !reservation.val().from && moment(to).isBefore(day)
              const isAfter = !reservation.val().to && moment(from).isAfter(day)
              const isNotBetween = !reservation.val().from && !reservation.val().to
              return !(isBefore || isAfter || isNotBetween)
            })
          } else return true
        })
    )).then(data => data.every(day => day))
)


// ---------------------------------------------------------------------------------------------------
/**
 * Checks a given period if a room is booked at that time
 * @param {Object} req - request object
 * @prop {number} req.roomId - room to be checked
 * @prop {string} req.date - date to be checked
 * @param {Object} res - response to be sent back
 * @returns {JSON}
 */
module.exports.overlaps = ({query: {roomId, date}}, res) => {
  // NOTE: Change origin to bibicvendeghazak.hu
  res.header("Access-Control-Allow-Origin", "*")
  const dateArray = date.split("-")

  switch (dateArray.length) {
  case 2:
    return getMonth(dateArray)
      .then(days => {

        const data = {}
        if (days) {
          Object.entries(days).forEach(([day, rooms]) => {
            if (rooms[roomId]) {
              const reservationKeys = Object.keys(rooms[roomId])
              if (reservationKeys.length < 2) {
                const reservation = rooms[roomId][reservationKeys[0]]
                if (!reservation.from && !reservation.to) {
                  data[day] = true
                }
              } else {
                data[day] = true
              }
            }
          })
        }
        return res.send(JSON.stringify(data))
      })
  case 5:
    return isAvailable(roomId, ...date.split("_").map(date => moment(date)))
      .then(data => res.send(JSON.stringify(data)))
  default:
    return res.send(JSON.stringify({error: "invalid date", message: "Try for example: 2018-04, 2018-04-24"}))
  }
}




