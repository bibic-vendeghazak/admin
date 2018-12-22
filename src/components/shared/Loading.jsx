import React from "react"
import PropTypes from "prop-types"
import EmptyState from "../../assets/empty-state.svg"
import {CircularProgress, Grid, Tooltip} from "@material-ui/core"


// NOTE: Better empty state
const Loading = ({isEmpty}) =>
  <Grid
    alignItems="center"
    container
    justify="center"
    style={{margin: "2.5em auto"}}
  >
    {
      isEmpty ?
        <Tooltip title="nincs találat">
          <img
            alt="nincs találat"
            src={EmptyState}
            style={{userSelect: "none"}}
          />
        </Tooltip> :
        <CircularProgress style={{padding: 24}} />
    }
  </Grid>

Loading.propTypes = {isEmpty: PropTypes.bool}

export default Loading