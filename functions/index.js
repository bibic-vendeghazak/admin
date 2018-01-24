const functions = require('firebase-functions')
const admin = require('firebase-admin')
const Moment = require('moment')
const MomentRange = require('moment-range')

const moment = MomentRange.extendMoment(Moment)
admin.initializeApp(functions.config().firebase)

exports.isRoomAvailable = functions.database
    .ref("/reservations/metadata/{reservationId}")
    .onCreate(event => {
        const {from, to, roomId} = event.data.val()
        const {reservationId} = event.params
        return checkRoomAvailability(reservationId, from, to, roomId)
    })

const checkRoomAvailability = (reservationId, from, to, newRoomId) => {
    const todayInterval = moment.range(moment().startOf("day"), moment().endOf("day"))
    const reservationsRef = admin.database().ref("reservations")
    const metadataRef = reservationsRef.child("metadata")
    const detailsRef = reservationsRef.child("details")
    return metadataRef.once("value", snap => {
        const reservations = snap.val()
        Object.keys(reservations).forEach(reservation => {
            const {from, to, roomId} = reservations[reservation]
            if (reservation !== reservationId && roomId === newRoomId) {
                if (todayInterval.overlaps(moment.range(moment(from), moment(to)))) {
                    console.log(`New reservation ${reservationId} 
                    overlaps with ${reservation}! Removing...`)
                    return Promise.all([
                        detailsRef.child(reservationId).remove(),
                        metadataRef.child(reservationId).remove()
                    ])
                }
            }
            return null
        })
        return null
        // return console.log(`New reservation ${reservationId} added to database!`)
    })
}