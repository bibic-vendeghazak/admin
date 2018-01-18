import React from 'react'

const Day = ({reservations, day, month , isPlaceholder, isToday, handleDayClick}) => {
  let rooms = []
  if (reservations) {
    Object.entries(reservations).forEach(reservation => {
      const [key,value] = reservation
      const {roomId, from, to} = value
      rooms.push(
        <li key={key} className={`reserved room-${roomId} ${from && to ? "from-to" : from ? "from" : to && "to"}`}/>
      )
    })
  }

  const handleClick = () => {
    handleDayClick({
      date: {day,month},
      dayReservations: Object.keys(reservations)
    })
  }

  return (
    <li
      className={`day ${isToday && "today"} day${isPlaceholder && "-placeholder"}`}
      onClick={() => !isPlaceholder && handleClick()}
    >
      <p>{day}</p>
      {!isPlaceholder &&
        <ul className="reserved-list">
          {rooms}
        </ul>
      }
    </li>
  )
}

export default Day
