const functions = require('firebase-functions')
const admin = require('firebase-admin')
const Moment = require('moment')
const MomentRange = require('moment-range')

const moment = MomentRange.extendMoment(Moment)
admin.initializeApp(functions.config().firebase)
const todayInterval = moment.range(moment().startOf("day"), moment().endOf("day"))
const reservationsRef = admin.database().ref("reservations")

exports.isOverlapError = functions.database
    .ref("reservations/{newId}")
    .onUpdate(({data, params: {newId}}) => {
        const {from, to, roomId: newRoom} = data.val().metadata
        const newInterval = moment.range(moment(from),moment(to))
        return reservationsRef.once("value", (snap) => {
            const reservations = snap.val()
            Object.keys(reservations).forEach(oldId => {
                const {metadata: {from, to, handled, roomId: oldRoom}} = reservations[oldId]
                const oldInterval = moment.range(moment(from), moment(to))
                if (handled && newInterval.overlaps(oldInterval) && newId !== oldId && newRoom === oldRoom) {
                    return Promise.all([
                                admin.database().ref("serverMessage").set({
                                    type: "error",
                                    message: `Szoba ${oldRoom} foglalt ebben az időintervallumban!`,
                                    newId, oldId
                                }),
                                reservationsRef.child(`${newId}/metadata/handled`).set(false)
                            ])
                }
                return null
            })
            return null
        })
    })


exports.isOverlapWarning = functions.database
    .ref("reservations/{newId}")
    .onCreate(({data, params: {newId}}) => {
        const {from, to, roomId: newRoom} = data.val().metadata
        const newInterval = moment.range(moment(from),moment(to))
        return reservationsRef.once("value", (snap) => {
            const reservations = snap.val()
            Object.keys(reservations).forEach(oldId => {
                const {metadata: {from, to, handled, roomId: oldRoom}} = reservations[oldId]
                const oldInterval = moment.range(moment(from), moment(to))
                if (handled && newInterval.overlaps(oldInterval) && newId !== oldId && newRoom === oldRoom) {
                    return admin.database()
                            .ref("serverMessage").set({
                                type: "warning",
                                message: `Szoba ${oldRoom} foglalt ebben az időintervallumban!`,
                                newId, oldId
                            })
                }
                return null
            })
            return null
        })
    })