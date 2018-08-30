import React from 'react'
import {Table, TableHead, TableBody, TableRow, TableCell} from '@material-ui/core'
import {withToolbar, EmptyTableBody, Loading} from '../../shared'
import FilteredSpecialRequests from './FilteredSpecialRequests'


const SpecialRequestsTable = ({
  specialRequests, isFetched, query
}) =>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell numeric padding="checkbox"></TableCell>
        <TableCell numeric>név</TableCell>
        <TableCell numeric>e-mail</TableCell>
        <TableCell numeric>telefon</TableCell>
        <TableCell numeric>rendezvény célja</TableCell>
        <TableCell numeric>időpont</TableCell>
        <TableCell numeric>igényelt ellátás</TableCell>
        <TableCell numeric>fő</TableCell>
        <TableCell numeric>részletek</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {isFetched ?
        <FilteredSpecialRequests {...{
          specialRequests,
          query
        }}
        />
        : <EmptyTableBody title={<Loading/>}/>
      }
    </TableBody>
  </Table>

export default withToolbar(SpecialRequestsTable)