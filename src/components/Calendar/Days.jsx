import React from 'react'
import moment from 'moment'

const Days = ({isPlaceholder = false, from = 0, to, currentDate, reservations, handleDayClick}) => {
  const days = []
  for (let day = from+1; day <= to; day++) {
    const isToday = currentDate && moment().isSame(currentDate.date(day),'day')
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
        month={currentDate.format("MMMM")}
        {...{
          key: day, isPlaceholder,
          reservations: dayReservations,
          day, isToday, handleDayClick, 
        }}
      />
    )
  }
  return days
}

const Day = ({reservations, day, month, isPlaceholder, isToday, handleDayClick}) => {
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
      date: {day, month},
      dayReservations: Object.keys(reservations)
    })
  }

  return (
    <li
      className={`day ${isToday && "today"} day${isPlaceholder && "-placeholder"}`}
      onClick={handleClick}
    >
      <p>{day}</p>
      <ul className="reserved-list">
        {rooms}
      </ul>
    </li>
  )
}

export default Days