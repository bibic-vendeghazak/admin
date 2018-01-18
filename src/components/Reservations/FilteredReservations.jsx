import React from 'react'
import Reservation from './Reservation'

const FilteredReservations = ({reservations, query, rooms, from, to, handled}) => {

  const filterByRoom = (listToFilter, rooms) => {
    const filteredList = new Set(listToFilter)
    listToFilter.forEach(filteredElement => {
      for (var i = 0; i < rooms.length; i++) {
        !rooms[i] && filteredElement.props.reservation.metadata.roomId - 1 === i && filteredList.delete(filteredElement)
      }
    })
    return Array.from(filteredList)
  }

  const filterByDate = (listToFilter, fromDate, toDate) => {
    const filteredList = []
    listToFilter.forEach(filteredElement => {
      const reservation = filteredElement.props.reservation.metadata
      const from = new Date(reservation.from)
      const to = new Date(reservation.to)
      if (from >= fromDate && to <= toDate) {
        filteredList.push(filteredElement)
      }
    })
    return filteredList
  }

  const filterByHandled = (listToFilter, handled) => {
    if (handled) {
      listToFilter = listToFilter.filter(filteredElement => filteredElement.props.reservation.metadata.handled)
    } else {
      listToFilter = listToFilter.filter(filteredElement => !filteredElement.props.reservation.metadata.handled)
    }
    return listToFilter
  }

  const filterByWords = (listToFilter, query) => {
    if (query !== null && query.length >= 1){
        const filteredList = []
        listToFilter.forEach(filteredElement => {
        const {message, name} = filteredElement.props.reservation.details
        if (message.toLowerCase().includes(query) || name.toLowerCase().includes(query)) {
          !filteredList.includes(filteredElement) && filteredList.push(filteredElement)
        }
      })
      return filteredList
    }
    return listToFilter
  }

  let filteredReservations = []
  for (let key in reservations) {
    const reservation = reservations[key]
    const reservationComponent = <Reservation key={key} id={key} reservation={reservation}/>
    filteredReservations.push(reservationComponent)
  }

  filteredReservations = filterByRoom(filteredReservations, rooms)
  filteredReservations = filterByHandled(filteredReservations, handled)
  filteredReservations = filterByDate(filteredReservations, from, to)
  filteredReservations = filterByWords(filteredReservations, query)

  // Unhandled reservations first
  let read = []
  let unread = []
  filteredReservations.forEach(filteredReservation => {
    filteredReservation.props.reservation.metadata.handled ?
    read.push(filteredReservation) :
    unread.push(filteredReservation)
  })
  return (
   <div>
     <h3 className="posts-header">Foglalások  <span className="notification-counter">{filteredReservations.length} </span> találat</h3>
     {filteredReservations.length !== 0 ?
       <ul id="filtered-reservations">
         {unread}
         {read}
       </ul> : <p>Nincs egyezés</p>
     }
   </div>
  )
}

export default FilteredReservations
