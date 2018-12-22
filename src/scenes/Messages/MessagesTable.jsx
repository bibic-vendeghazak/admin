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
        <TableCell numeric padding="checkbox"></TableCell>
        <TableCell numeric>név</TableCell>
        <TableCell numeric>e-mail</TableCell>
        <TableCell numeric>telefon</TableCell>
        <TableCell numeric>téma</TableCell>
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