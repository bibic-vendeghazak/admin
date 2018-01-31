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
                const {metadata: {from, to, handled, roomId: oldRoom}, lastHandledBy} = reservations[oldId]
                const oldInterval = moment.range(moment(from), moment(to))
                if (handled && newInterval.overlaps(oldInterval) && newId !== oldId && newRoom === oldRoom) {
                    return Promise.all([
                                admin.database().ref("serverMessage").set({
                                    type: "error",
                                    message: `Szoba ${oldRoom} foglalt ebben az időintervallumban!`,
                                    newId, oldId
                                }),
                                reservationsRef.child(`${newId}/metadata/handled`).set(false),
                                reservationsRef.child(`${newId}/lastHandledBy`).set(lastHandledBy)
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





// const generateCombinations = (source, a, b, oldA, oldB) => {
//     const childAgeGroups=["0-5", "6-11", "12-17"]
//     for(let i=1; i<=(a>oldA ? a : oldA); i++) {
//         for(let j=0; j<=(b>oldB ? b : oldB)+1; j++){
//             childAgeGroups.forEach(childAgeGroup => {
//                 if (j!==0) {
//                     if(!source[`${i}_${j}_${childAgeGroup}`]) {
//                         source[`${i}_${j}_${childAgeGroup}`] = 0
//                     }
//                     if (i>a || j>b || i+j > a) {
//                         delete source[`${i}_${j}_${childAgeGroup}`]
//                     }
//                 } else {
//                     if(!source[`${i}_${j}`]) {
//                         source[`${i}_${j}`] = 0
//                     }
                    
//                 }
//             })
//         }
//     }
//     return source
// }

// exports.populatePrices = functions.database
//     .ref("rooms/{roomId}")
//     .onUpdate(({data, params}) => {
//         const {
//             maxAdults: oldMaxAdults,
//             maxChildren: oldMaxChildren
//         } = data.previous.val()
//         const {
//             maxAdults, maxChildren, prices
//         } = data.val()
//         const {roomId} = params
        
//         const newPrices = {}
//         Object.keys(prices).forEach(priceType => {
//             newPrices[priceType] = generateCombinations(prices[priceType], maxAdults, maxChildren, oldMaxAdults, oldMaxChildren)
//         })
//         return admin.database().ref(`rooms/${roomId}/prices`).set(newPrices)

//     })