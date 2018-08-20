import React from "react"
import {Link} from "react-router-dom"
import {routes} from '../../utils'
import {Typography, Grid, Button, Paper} from '@material-ui/core'

import Back from '@material-ui/icons/ArrowBackRounded'

const NoMatch = () =>
  <Grid
    alignItems="center"
    container
    direction="column"
    justify="center"
    style={{minHeight: "calc(100vh - 64px)"}}
  >
    <Paper style={{padding: 32}}>
      <Typography variant="display1">Itt nincs semmi</Typography>
      <Button color="primary" component={Link} to={routes.RESERVATIONS} variant="contained">
        <Back/> Vissza a foglalásokhoz
      </Button>
    </Paper>
  </Grid>

export default NoMatch