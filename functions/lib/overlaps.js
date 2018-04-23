const functions = require('firebase-functions')
const admin = require('firebase-admin')
const moment = require('./moment')



// ---------------------------------------------------------------------------------------------------
// Helper functions

/**
 * Checks a given month if a room is booked at that time
 * @param {number} roomId - (1) room to check
 * @param {string} date - (2018-12) month to check
 * @returns {JSON}
 */
const monthOverlap = (roomId, date) => (
	admin
		.database()
		.ref(`reservationDates/${date.split("-").join("/")}`)
		.once("value").then(snap => {
			return snap ? snap.val() :  {status: "ERROR", message: "No result was found."}
		})
)



// ---------------------------------------------------------------------------------------------------
/**
 * Checks a given period if a room is booked at that time
 * @param {Object} req - request object
 * @prop {number} req.roomId - room to be checked
 * @prop {enum} req.type - (month|day)
 * @prop {string} req.date - date to be checked
 * @param {Object} res - response to be sent back
 * @returns {JSON}
 */
module.exports.overlaps = (req, res) => {
	let {roomId, type, date} = req.query
	if (type === "month") {
		return monthOverlap(roomId, date)
						.then(days => {
							data = {}
							Object.keys(days).forEach(day => {
								if (days[day].includes("r"+roomId)) {
									data[`${date}-${day}`] = roomId
								}
							})
							return res.send(JSON.stringify(days))
						})
	} else {
		return console.log("Implement day overlap????")
	}
}




