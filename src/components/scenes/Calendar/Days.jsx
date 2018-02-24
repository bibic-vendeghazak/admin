import React from 'react'
import {Link, withRouter} from 'react-router-dom'
import moment from 'moment'


const Days = ({location, isPlaceholder = false, from = 0, to, currentDate, reservations, handleDayClick}) => {
  const days = []
  for (let day = from+1; day <= to; day++) {
    let dayReservations = {}
    Object.keys(reservations).forEach(key => {
      const value = reservations[key]
      const {from, to, roomId} = value
      const currentDay = currentDate.clone().date(day)
      const dayFrom = moment(from).startOf('day')
      const dayTo = moment(to).endOf('day')
      const dateRange = moment.range(dayFrom, dayTo)
      if (dateRange.contains(currentDay)) {
        const reservation = dayReservations[key] = {roomId}
        Object.assign(
          reservation,
          {
            from: currentDay.isSame(dayFrom, "day"),
            to: currentDay.isSame(dayTo, 'day')
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
          reservations: dayReservations,
          handleDayClick
        }}
      />
    )
  }
  return days
}

const Day = ({location: {pathname}, reservations, date, isPlaceholder, handleDayClick}) => {
  let rooms = []  
  Object.entries(reservations).forEach(reservation => {
    const [key,value] = reservation
    const {roomId, from, to} = value
    rooms.push(
      <li key={key} className={`reserved room-${roomId} ${from && to ? "from-to" : from ? "from" : to && "to"}`}/>
    )
  })

  const handleClick = () => {
    handleDayClick({
      date, dayReservations: Object.keys(reservations)
    })
  }
  
  const isToday = moment().isSame(date,'day')
  const year = date.format("YYYY")
  const month = date.format("MM")
  const day = date.format("DD")
  return (
    <li
        onClick={handleClick}
        className={`day ${isToday && "today"} day${isPlaceholder && "-placeholder"}`}
        >
      {/* <Link 
        className={`day ${isToday && "today"} day${isPlaceholder && "-placeholder"}`}
        to={pathname+"/"+year+"/"+month+"/"+day} 
        style={{textDecoration: "none"}}> */}
          <p>{date.format('D')}</p>
          <ul className="reserved-list">
            {rooms}
          </ul>
      {/* </Link> */}
    </li>
  )
}

export default withRouter(Days)