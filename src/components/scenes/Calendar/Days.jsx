import React from "react"
import {Link, withRouter} from "react-router-dom"
import moment from "moment"
import { CALENDAR } from "../../../utils/routes"


const Days = ({location, isPlaceholder = false, from = 0, to, currentDate, reservations}) => {
	const days = []
	for (let day = from + 1; day <= to; day++) {
		let dayReservations = {}
		Object.keys(reservations).forEach(key => {
			const value = reservations[key]
			const {from, to, roomId} = value
			const currentDay = currentDate.clone().date(day)
			const dayFrom = moment(from.seconds*1000 || from).startOf("day")
			const dayTo = moment(to.seconds*1000 || to).endOf("day")
			const dateRange = moment.range(dayFrom, dayTo)
			if (dateRange.contains(currentDay)) {
				const reservation = dayReservations[key] = {roomId}
				Object.assign(
					reservation,
					{
						from: currentDay.isSame(dayFrom, "day"),
						to: currentDay.isSame(dayTo, "day")
					}
				)
			}
		})

		days.push(
			<Day
				date={currentDate.clone().date(day)}
				{...{
					location,
					key: day, isPlaceholder,
					reservations: dayReservations
				}}
			/>
		)
	}
	return days
}

const Day = ({location: {pathname}, reservations, date, isPlaceholder}) => {
	let rooms = []
	Object.keys(reservations).forEach(key => {
		const {roomId, from, to} = reservations[key]
		
		const reservationState = from ? "from" : to && "to"
		rooms.push(<li {...{key}} className={`reserved room-${roomId} ${reservationState}`}/>)
	})

	const isToday = moment().isSame(date, "day") ? "today" : ""
	isPlaceholder = isPlaceholder ? "-placeholder" : ""
	const day = date.clone().format("D")
  
	return (
		Object.keys(reservations).length ?
			<Link
				className={`day ${isToday} day${isPlaceholder}`}
				to={`${CALENDAR}/${date.clone().format("YYYY/MM/DD")}`} 
			>
				<p>{day}</p>
				<ul className="reserved-list">
					{rooms}
				</ul>
			</Link> :
			<div className={`day ${isToday} day${isPlaceholder}`}>
				<p>{day}</p>
			</div>
	)
}

export default withRouter(Days)