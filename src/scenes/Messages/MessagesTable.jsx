import React from 'react'
import {Table, TableHead, TableBody, TableRow, TableCell} from '@material-ui/core'
import {withToolbar, EmptyTableBody, Loading} from "../../components/shared"
import FilteredMessages from './FilteredMessages'


const MessagesTable = ({
  messages, isFetched, query
}) =>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell align="center" padding="checkbox"></TableCell>
        <TableCell align="center">név</TableCell>
        <TableCell align="center">e-mail</TableCell>
        <TableCell align="center">telefon</TableCell>
        <TableCell align="center">téma</TableCell>
        <TableCell></TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {isFetched ?
        <FilteredMessages {...{
          messages,
          query
        }}
        />
        : <EmptyTableBody title={<Loading/>}/>
      }
    </TableBody>
  </Table>

export default withToolbar(MessagesTable)