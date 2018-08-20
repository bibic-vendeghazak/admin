import React from "react"
import moment from 'moment'
import {Link, withRouter} from "react-router-dom"

import {routes, toRoute, colors} from "../../../utils"
import {Background, Loading} from '../../shared'

import {TableRow, TableCell, Hidden, Tooltip, IconButton, Typography} from "@material-ui/core"

import Details from '@material-ui/icons/OpenInNewRounded'
import New from '@material-ui/icons/NewReleasesRounded'


/**
 * @param {string} order - Order of the array. (eg.: asc, desc)
 * @param {string} orderBy - Property to sort the array by.
 */

const sortReservations = (order, orderBy) => (a, b) =>
  order === 'desc' ? (b[orderBy] > a[orderBy]) - (b[orderBy] < a[orderBy]) :
    (a[orderBy] > b[orderBy]) - (a[orderBy] < b[orderBy])

const filterByQuery = query => ({
  name, message
}) => query
  .some(word => [name, message].join(" ")
    .toLowerCase()
    .includes(word)
  )

const filterByRooms = roomsFilter => ({roomId}) =>
  roomsFilter ? roomsFilter[roomId-1] : true

const FilteredReservations = ({
  query, order, orderBy, history, handledReservations, unhandledReservations, roomsFilter
}) => {

  const renderReservations = reservations =>
    reservations
      .filter(filterByRooms(roomsFilter))
      .filter(filterByQuery(query))
      .sort(sortReservations(order, orderBy))
      .map(({
        key, id, roomId, from, to, name, handled, email, tel, timestamp
      }) =>
        <TableRow
          hover
          key={key}
          onClick={() => history.push(toRoute(routes.RESERVATIONS, key))}
        >
          <TableCell
            numeric
            padding="checkbox"
          >
            {!handled ? <Tooltip title="Új foglalás"><New color="secondary"/></Tooltip> : null}
          </TableCell>
          <Hidden mdUp>
            <TableCell
              numeric
              padding="dense"
            >#{id}</TableCell>
          </Hidden>
          <TableCell
            numeric
            padding="none"
          >{name}</TableCell>
          <Hidden smDown>
            <TableCell
              numeric
              padding="checkbox"
            >
              <Background color={colors[`room${roomId}`]}>
                {roomId}
              </Background>
            </TableCell>
          </Hidden>
          <Hidden mdDown>
            <TableCell
              numeric
              padding="none"
            ><a href={`mailto:${email}`}>{email}</a></TableCell>
            <TableCell
              numeric
              padding="none"
            ><a href={`tel:${tel}`}>{tel}</a></TableCell>
          </Hidden>
          <Hidden smDown>
            <TableCell numeric>{from && moment(from.toDate()).format("YYYY MMM. DD.")}</TableCell>
            <TableCell numeric>{from && moment(to.toDate()).format("YYYY MMM. DD.")}</TableCell>
          </Hidden>
          <Hidden mdDown>
            <TableCell numeric>
              <Typography variant="caption">
                {timestamp && moment(timestamp.toDate()).fromNow()}
              </Typography>
            </TableCell>
          </Hidden>
          <TableCell
            numeric
            padding="checkbox"
          >
            <Tooltip title="Részletek">
              <IconButton
                color="primary"
                component={Link}
                to={toRoute(routes.RESERVATIONS, key)}
                variant="text"
              >
                <Details/>
              </IconButton>
            </Tooltip>
          </TableCell>
        </TableRow>
      )

  handledReservations = renderReservations(handledReservations)
  unhandledReservations = renderReservations(unhandledReservations)

  return handledReservations.length + unhandledReservations.length ?
    [unhandledReservations, handledReservations] :
    <EmptyTableBody/>
}

FilteredReservations.defaultProps = {
  query: [""],
  order: "asc",
  orderBy: "roomId"
}


export default withRouter(FilteredReservations)


export const EmptyTableBody = ({title=<Loading isEmpty/>}) =>
  <TableRow>
    <TableCell colSpan={10}>
      <Typography
        align="center"
        variant="subheading"
      >
        {title}
      </Typography>
    </TableCell>
  </TableRow>