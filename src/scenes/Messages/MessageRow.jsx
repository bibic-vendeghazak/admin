import React from "react"

import {Link, withRouter} from "react-router-dom"
import {TableRow, TableCell, Tooltip, IconButton} from "@material-ui/core"

import New from "@material-ui/icons/NewReleasesRounded"
import Details from "@material-ui/icons/OpenInNewRounded"
import {routes, toRoute} from "../../utils"
import {translateSubject} from "../../utils/language"


const MessageRow = ({
  name, accepted, email, tel, subject, id, history
}) =>
  <TableRow
    hover
    onClick={() => history.push(toRoute(routes.MESSAGES, id))}
  >
    <TableCell numeric padding="checkbox">{!accepted &&
  <Tooltip title="Kezeletlen">
    <New color="secondary"/>
  </Tooltip>
    }</TableCell>
    <TableCell numeric>{name}</TableCell>
    <TableCell numeric><a href={`mailto:${email}`}>{email}</a></TableCell>
    <TableCell numeric><a href={`tel:${tel}`}>{tel}</a></TableCell>
    <TableCell numeric>{translateSubject(subject)}</TableCell>
    <TableCell numeric>
      <Tooltip title="Részletek">
        <IconButton
          component={Link}
          to={toRoute(routes.MESSAGES, id)}
        >
          <Details/>
        </IconButton>
      </Tooltip>
    </TableCell>
  </TableRow>

export default withRouter(MessageRow)