import React from 'react'

import {TableRow, TableCell, Typography} from "@material-ui/core"
import Loading from './Loading'


const EmptyTableBody = ({title=<Loading isEmpty/>}) =>
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


export default EmptyTableBody