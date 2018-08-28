import React from 'react'
import moment from "moment"
import {Link} from "react-router-dom"
import {TableRow, TableCell, Tooltip, IconButton} from '@material-ui/core'
import {EmptyTableBody} from '../../shared'

import New from '@material-ui/icons/NewReleasesRounded'
import Details from '@material-ui/icons/OpenInNewRounded'
import {routes, toRoute} from '../../../utils'


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
        id, name, accepted, subject, tel, peopleCount, from, service
      }) =>
        <TableRow key={id}>
          <TableCell numeric padding="checkbox">{!accepted &&
            <Tooltip title="Kezeletlen">
              <New color="secondary"/>
            </Tooltip>
          }</TableCell>
          <TableCell numeric>{name}</TableCell>
          <TableCell numeric>{tel}</TableCell>
          <TableCell numeric>{subject}</TableCell>
          <TableCell numeric>{moment(from.toDate()).format("YYYY MMM. D.")}</TableCell>
          <TableCell numeric>{service}</TableCell>
          <TableCell numeric>{peopleCount}</TableCell>
          <TableCell numeric>
            <Tooltip title="Részletek">
              <IconButton
                component={Link}
                to={toRoute(routes.SPECIAL_REQUESTS, id)}
              >
                <Details/>
              </IconButton>
            </Tooltip>
          </TableCell>
        </TableRow>
      )

  specialRequests = renderSpecialRequests(specialRequests)
  return (
    specialRequests.length ? specialRequests : <EmptyTableBody/>
  )
}

export default FilteredSpecialRequests