import React from 'react'
import {Paper, ListItem, ListItemText, Grid} from '@material-ui/core'

const Stat = ({
  name, value
}) =>
  <Grid item>
    <Paper>
      <ListItem>
        <ListItemText primary={value} secondary={name}/>
      </ListItem>
    </Paper>
  </Grid>

export default Stat