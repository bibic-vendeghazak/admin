import React from "react"

import {EmptyTableBody, withToolbar} from "../../components/shared"
import {Table, TableBody, TableHead, TableRow, TableCell, Hidden} from "@material-ui/core"
import FilteredFeedbacks from "./FilteredFeedbacks"
import {withStore} from "../../db"

const FeedbacksTable = ({
  unhandledFeedbacks,
  handledFeedbacks, feedbacksFilters
}) =>
  <Table>
    <TableHead>
      <TableRow>
        <Hidden mdDown>
          <TableCell padding="checkbox"></TableCell>
          <TableCell align="center" padding="dense">szoba</TableCell>
        </Hidden>
        <TableCell padding="dense">üzenet/értékelés</TableCell>
        <TableCell align="center" padding="checkbox"></TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {unhandledFeedbacks && handledFeedbacks ?
        <FilteredFeedbacks
          filteredRooms={feedbacksFilters.filteredRooms}
          query={feedbacksFilters.query}
          {...{
            unhandledFeedbacks,
            handledFeedbacks
          }}
        /> : <EmptyTableBody/>
      }
    </TableBody>
  </Table>


export default withStore(withToolbar(FeedbacksTable))