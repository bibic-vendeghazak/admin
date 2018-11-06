import React from "react"

import {Link, withRouter} from "react-router-dom"
import {TableRow, TableCell, Tooltip, IconButton} from "@material-ui/core"

import New from "@material-ui/icons/NewReleasesRounded"
import Details from "@material-ui/icons/OpenInNewRounded"
import {routes, toRoute} from "../../../utils"

const MessageRow = ({
  name, accepted, email, tel, subject, service, peopleCount, id, history
}) =>
  <TableRow
    hover
    onClick={() => history.push(toRoute(routes.SPECIAL_REQUESTS, id))}
  >
    <TableCell numeric padding="checkbox">{!accepted &&
  <Tooltip title="Kezeletlen">
    <New color="secondary"/>
  </Tooltip>
    }</TableCell>
    <TableCell numeric>{name}</TableCell>
    <TableCell numeric><a href={`mailto:${email}`}>{email}</a></TableCell>
    <TableCell numeric><a href={`tel:${tel}`}>{tel}</a></TableCell>
    <TableCell numeric>{subject}</TableCell>
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

export default withRouter(MessageRow)