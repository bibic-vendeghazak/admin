import React from 'react'
import Room from './Room'

const Rooms = (props) => {
  const {rooms, roomServices} = props
  const roomsList = []
  if (rooms) {
    rooms.forEach(room => {
      roomsList.push(<Room key={room.id} room={room} services={roomServices}/>)
    })
  }
  return (
    <div className="rooms posts-wrapper">
      <ul>
        {roomsList}
      </ul>
    </div>
  )
}

export default Rooms
