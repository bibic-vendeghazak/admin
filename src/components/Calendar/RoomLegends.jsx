import React from 'react'

const RoomLegend = ({id}) => {

  const handleClick = e => {
    e.target.classList.toggle(`unchecked`)
    const rooms = document.querySelectorAll(`.reserved.room-${id}`)
    rooms.forEach(room => {
      room.classList.toggle('hidden')
    })
  }

  return(
   <li >
     <p
       className={`room-${id}`}
       onClick={handleClick}
     >{id}</p>
   </li>
  )
}

const RoomLegends = () => {
  return(
    <ul className="room-legend">
      {Array(6).fill().map((x,i) => <RoomLegend key={i} id={i+1}/>)}
    </ul>
  )
}

export default RoomLegends
