import React from "react"
import PropTypes from 'prop-types'
import {Link, withRouter} from "react-router-dom"
import moment from "moment"
import {routes, toRoute} from "../../../utils"
import {Tooltip} from "@material-ui/core"


const Days = ({
  location, isPlaceholder = false, from = 0, to, currentDate, reservations
}) => {
  const days = []
  for (let day = from + 1; day <= to; day++) {
    const dayReservations = {}
    Object.entries(reservations).forEach(([
      key, {
        from, to, roomId
      }
    ]) => {
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
          key: day,
          isPlaceholder,
          reservations: dayReservations
        }}
      />
    )
  }
  return days
}

const Day = ({
  reservations, date, isPlaceholder
}) => {
  reservations = Object.values(reservations)
  return (
    <li className={`day-tile ${isPlaceholder ? "placeholder" : ""}`}>
      <p className={moment().isSame(date, "day") ? "today" : ""}>
        {date.clone().format("D")}
      </p>
      {reservations.length ?
        <Tooltip title={`Foglalva: ${reservations.map(({roomId}) => roomId).join(", ")}`}>
          <Link to={toRoute(routes.CALENDAR, date.clone().format("YYYY/MM/DD"))}>
            <ul className="reserved-list">
              {reservations.map(({
                roomId, from, to
              }) =>
                <li
                  className={`room-${roomId} ${from ? "from" : to && "to"}`}
                  key={roomId}
                />
              )}
            </ul>
          </Link>
        </Tooltip>
        : null}
    </li>
  )
}

Day.propTypes = {
  reservations: PropTypes.object,
  date: PropTypes.object,
  isPlaceholder: PropTypes.bool
}

export default withRouter(Days)