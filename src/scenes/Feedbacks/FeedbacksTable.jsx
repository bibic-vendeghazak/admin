import React from "react"

import {EmptyTableBody, withToolbar} from "../../components/shared"
import {Table, TableBody, TableHead, TableRow, TableCell, Hidden} from "@material-ui/core"
import FilteredFeedbacks from "./FilteredFeedbacks"
import {withStore} from "../../db"

const FeedbacksTable = ({
  unhandledFeedbacks,
  handledFeedbacks, query,
  filteredRooms
}) =>
  <Table>
    <TableHead>
      <TableRow>
        <Hidden mdDown>
          <TableCell padding="checkbox"></TableCell>
          <TableCell numeric padding="dense">szoba</TableCell>
        </Hidden>
        <TableCell padding="dense">üzenet/értékelés</TableCell>
        <TableCell numeric padding="checkbox"></TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {unhandledFeedbacks && handledFeedbacks ?
        <FilteredFeedbacks
          {...{
            query,
            filteredRooms,
            unhandledFeedbacks,
            handledFeedbacks
          }}
        /> : <EmptyTableBody/>
      }
    </TableBody>
  </Table>


export default withStore(withToolbar(FeedbacksTable))