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
       onClick={e => handleClick(e)}
     >
       {id}
     </p>
   </li>
  )
}

export default RoomLegend
