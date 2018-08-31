import React from 'react'
import {Grid, ListItem, ListItemText, ListItemIcon} from '@material-ui/core'

const Item = ({
  icon, primary, secondary, ...props
}) =>
  <Grid item md={4} sm={6} {...props}>
    <ListItem>
      <ListItemIcon>
        {icon}
      </ListItemIcon>
      <ListItemText
        primary={primary}
        secondary={secondary}
      />
    </ListItem>
  </Grid>

export default Item