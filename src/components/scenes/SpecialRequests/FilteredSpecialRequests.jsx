import React from 'react'
import {EmptyTableBody} from '../../shared'

import SpecialRequestRow from './SpecialRequestRow'


const filterByQuery = query => ({
  name, message, subject, service
}) =>
  query.some(word =>
    [name, message, subject, service]
      .map(e => e.toLowerCase())
      .join(" ")
      .includes(word)
  )


const FilteredSpecialRequests = ({
  specialRequests, query
}) => {

  const renderSpecialRequests = specialRequests =>
    specialRequests
      .filter(filterByQuery(query))
      .map(({
        id, ...specialRequest
      }) =>
        <SpecialRequestRow id={id} key={id} {...specialRequest}/>
      )

  specialRequests = renderSpecialRequests(specialRequests)
  return (
    specialRequests.length ? specialRequests : <EmptyTableBody/>
  )
}

export default FilteredSpecialRequests