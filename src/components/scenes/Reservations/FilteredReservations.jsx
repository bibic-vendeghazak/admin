import React from 'react'

import {List} from 'material-ui/List'

import Reservation from './Reservation'

import {PlaceholderText} from '../../shared'


const FilteredReservations = ({reservations, query, rooms, from, to}) => {
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
      const {reservation} = filteredElement.props
      const from = new Date(reservation.from)
      const to = new Date(reservation.to)
      if (from >= fromDate && to <= toDate) {
        filteredList.push(filteredElement)
      }
    })
    return filteredList
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
    const reservationComponent = <Reservation id={key} {...{key, reservation}}/>
    filteredReservations.push(reservationComponent)
  }

  filteredReservations = filterByRoom(filteredReservations, rooms)
  filteredReservations = filterByDate(filteredReservations, from, to)
  filteredReservations = filterByWords(filteredReservations, query)

  return (
    <div>
      {filteredReservations.length !== 0 ?
        <List>
          {filteredReservations}
        </List> : <PlaceholderText>Nincs egyezés</PlaceholderText>
      }
    </div>
  )
}

export default FilteredReservations
