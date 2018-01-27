const functions = require('firebase-functions')
const admin = require('firebase-admin')
const Moment = require('moment')
const MomentRange = require('moment-range')

const moment = MomentRange.extendMoment(Moment)
admin.initializeApp(functions.config().firebase)
const todayInterval = moment.range(moment().startOf("day"), moment().endOf("day"))
const reservationsRef = admin.database().ref("reservations")


exports.isOverlap = functions.database
    .ref("reservations/{reservationId}")
    .onUpdate(event => {
        const {from, to, roomId} = event.data.val().metadata
        const {reservationId} = event.params
        const newReservationInterval = moment.range(moment(from),moment(to))
        return reservationsRef.once("value", snap => {
            const reservations = snap.val()
            Object.keys(reservations).forEach(reservation => {
                const {from, to, handled, roomId} = reservations[reservation].metadata
                if (handled && moment.range(moment(from), moment(to)).overlaps(newReservationInterval)) {
                    return admin.database().ref("error").set({
                        message: `Szoba ${roomId} foglalt ebben az időintervallumban!`,
                        newReservation: reservationId,
                        oldReservation: reservation
                    }).then(() => {
                        return reservationsRef.child(`${reservationId}/metadata/handled`).set(false)
                    })
                }
                return null
            })
            return null
        })
    })

// exports.isRoomAvailable = functions.database
//     .ref("reservations/{reservationId}")
//     .onCreate(event => {
//         const {from, to, roomId} = event.data.val().metadata
//         const newReservationInterval = moment.range(moment(from), moment(to))
//         return checkRoomAvailability(reservationId, newReservationInterval, roomId)
//     })

// const checkRoomAvailability = (reservationId, newReservationInterval, newRoomId) => {
//     return reservationsRef.once("value", snap => {
//         const reservations = snap.val()
//         Object.keys(reservations).forEach(reservation => {
//             const {from, to, roomId, handled} = reservations[reservation].metadata
//             if (handled && reservation !== reservationId && roomId === newRoomId) {
//                 if (todayInterval.overlaps(newReservationInterval)) {
//                     console.log(`New reservation ${reservationId} 
// overlaps with ${reservation}! Removing...`)
//                     return reservationsRef.child(reservationId).remove()
//                 }
//             }
//             return null
//         })
//         return null
//         // return console.log(`New reservation ${reservationId} added to database!`)
//     })
// }