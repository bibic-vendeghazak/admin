import React from "react"
import moment from 'moment'
import {Link, withRouter} from "react-router-dom"

import {routes, toRoute, colors} from "../../utils"
import {Background, EmptyTableBody} from "../../components/shared"

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

const filterByQuery = query => ({name, message, id}) => query
  .some(word => [name, message, id].join(" ")
    .toLowerCase()
    .includes(word)
  )

const filterByRoom = filteredRooms => ({roomId}) =>
  filteredRooms.length ? filteredRooms[roomId-1] : true

const FilteredReservations = ({
  order, orderBy,
  handledReservations, unhandledReservations,
  query, filteredRooms,
  history
}) => {

  const renderReservations = reservations =>
    reservations
      .filter(filterByRoom(filteredRooms))
      .filter(filterByQuery(query))
      .sort(sortReservations(order, orderBy))
      .flatMap(reservation => {
        if (reservation.roomId === "all") {
          // REVIEW: Use rooms length
          return Array(6).fill(null).map((_e, index) => ({...reservation, roomId: index + 1}))
        }
        return reservation
      })
      .map(({
        key, id, roomId, from, to, name, handled, email, tel, timestamp, archived
      }) =>
        <TableRow
          hover
          key={key+roomId}
          onClick={() => history.push(toRoute(routes.RESERVATIONS, key))}
          selected={archived}
          title={archived ? "Archivált foglalás" : null}
        >
          <TableCell
            align="center"
            padding="checkbox"
          >
            {!handled ? <Tooltip title="Új foglalás"><New color="secondary"/></Tooltip> : null}
          </TableCell>
          <Hidden mdUp>
            <TableCell
              align="center"
              padding="dense"
            >#{id}</TableCell>
          </Hidden>
          <TableCell
            align="center"
            padding="none"
          >{name}</TableCell>
          <Hidden smDown>
            <TableCell
              align="center"
              padding="checkbox"
            >
              <Background color={colors[`room${roomId}`]}>
                {roomId}
              </Background>
            </TableCell>
          </Hidden>
          <Hidden mdDown>
            <TableCell
              align="center"
              padding="none"
            >
              {email !== "email@email.hu" ? <a href={`mailto:${email}`}>{email}</a> : "-"}
            </TableCell>

            <TableCell
              align="center"
              padding="none"
            >
              {tel !== "000-000-000" ? <a href={`tel:${tel}`}>{tel}</a> : "-"}
            </TableCell>
          </Hidden>
          <Hidden smDown>
            <TableCell align="center">{from && moment(from.toDate()).format("YYYY MMM. DD.")}</TableCell>
            <TableCell align="center">{from && moment(to.toDate()).format("YYYY MMM. DD.")}</TableCell>
          </Hidden>
          <Hidden mdDown>
            <TableCell align="center">
              <Typography >
                {timestamp && moment(timestamp.toDate()).fromNow()}
              </Typography>
            </TableCell>
          </Hidden>
          <TableCell
            align="center"
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
  orderBy: "roomId",
  filteredRooms: []
}


export default withRouter(FilteredReservations)


