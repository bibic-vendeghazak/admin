const functions = require('firebase-functions')
const admin = require('firebase-admin')
const moment = require('./moment')


module.exports.overlaps = (req, res) => {
	let {roomId, type, date} = req.query
	if (type === "month") {
		return monthOverlap(roomId, date)
						.then(days => {
							console.log(days);
							data = {}

							Object.keys(days).forEach(day => {
								if (days[day].includes("r"+roomId)) {
									const dayKey = `${date}-${day}`
									data[dayKey] = roomId
								}
							})
							
							
							
							return res.send(JSON.stringify(days))})

						// const data = {}
						// snap.forEach(day => {
						// 	day = Object.keys(day.val())
						// 	if (day.includes("r"+roomId)) {
						// 		data[dayKey] = roomId
						// 	}
						// })
	} else {
		return console.log("Implement day overlap????")
	}
}


const monthOverlap = (roomId, date) => {
	dateArray = date.split("-")
	return admin.database()
							.ref(`reservationDates/${dateArray[0]}/${dateArray[1]}`)
							.once("value").then(snap => {
								if (snap) {
									return snap.val()
								} else return {status: "ERROR", message: "No result was found."}
							})
}

module.exports.getOverlaps = (req, res) => {
	let {roomId,month} = req.query
	roomId = parseInt(roomId, 10)
	const monthStart = moment(`${month}-01`)
	const monthEnd = monthStart.clone().add(1, "months").subtract(1, "days")
	const monthRange = Array.from(moment.range(monthStart, monthEnd).by("days"))
	return admin.database().ref("reservations")
		.once("value").then(snap => {
			let overlaps = {}
			snap.forEach(reservation => {
				let { from, to, handled, roomId: reservedRoomId} = reservation.val()
				to = moment(to)
				from = moment(from)
				if (roomId === reservedRoomId && handled) {
					monthRange.forEach(day => {
						const reservationRange = moment.range(from, to)
						const start = day.clone().startOf("day")
						const end = day.clone().endOf("day")
						const dayRange = moment.range(start, end)
						const isOverlap = reservationRange.overlaps(dayRange)
						day = day.format("YYYY-MM-DD")
						const reserveBeforeNoonTrue = overlaps[day] && overlaps[day].beforeNoon === true ? true : false
						const reserveAfterNoonTrue = overlaps[day] && overlaps[day].afterNoon === true ? true : false
						const beforeNoon = dayRange.contains(to)
						const afterNoon = dayRange.contains(from)
						if (isOverlap) {
							if (!beforeNoon && !afterNoon) {
								console.log("someone is staying on: ", day)
								overlaps[day] = {
									beforeNoon: true,
									afterNoon: true
								}
							} else if (beforeNoon && !afterNoon) {
								console.log("someone is leaving on: ", day)
								overlaps[day] = {
									beforeNoon: true,
									afterNoon: reserveAfterNoonTrue
								}
							} else if (!beforeNoon && afterNoon) {
								console.log("someone is arriving on: ", day)
								overlaps[day] = {
									beforeNoon: reserveBeforeNoonTrue,
									afterNoon: true
								}
							}
						} else {
							overlaps[day] = {
								beforeNoon: reserveBeforeNoonTrue,
								afterNoon: reserveAfterNoonTrue
							}
						}
					})
				}
			})
			return overlaps
		})
		.then(data => res.send(JSON.stringify(data)))
}


// module.exports.isOverlapError = functions.database
//     .ref("reservations/{newId}")
//     .onUpdate(({data, params: {newId}}) => {
//         const {from, to, roomId: newRoom} = data.val()
//         const newInterval = moment.range(moment(from),moment(to))
//         return reservationsRef.once("value", (snap) => {
//             const reservations = snap.val()
//             Object.keys(reservations).forEach(oldId => {
//                 const {from, to, handled, roomId: oldRoom, lastHandledBy} = reservations[oldId]
//                 const oldInterval = moment.range(moment(from), moment(to))
//                 if (handled && newInterval.overlaps(oldInterval) && newId !== oldId && newRoom === oldRoom) {
//                     return Promise.all([
//                                 admin.database().ref("serverMessage").set({
//                                     type: "error",
//                                     message: "A szoba foglalt ebben az intervallumban"
//                                 }),
//                                 reservationsRef.child(`${newId}/handled`).set(false),
//                                 reservationsRef.child(`${newId}/lastHandledBy`).set(lastHandledBy)
//                             ])
//                 }
//                 return null
//             })
//             return null
//         })
//     })


// module.exports.isOverlapWarning = functions.database
//     .ref("reservations/{newId}")
//     .onCreate(({data, params: {newId}}) => {
//         const {from, to, roomId: newRoom} = data.val()
//         const newInterval = moment.range(moment(from),moment(to))
//         return reservationsRef.once("value", (snap) => {
//             const reservations = snap.val()
//             Object.keys(reservations).forEach(oldId => {
//                 const {from, to, handled, roomId: oldRoom} = reservations[oldId]
//                 const oldInterval = moment.range(moment(from), moment(to))
//                 if (handled && newInterval.overlaps(oldInterval) && newId !== oldId && newRoom === oldRoom) {
//                     return admin.database()
//                             .ref("serverMessage").set({
//                                 type: "warning",
//                                 message: "Szoba foglalt ebben az intervallumban!"
//                             })
//                 }
//                 return null
//             })
//             return null
//         })
//     })

