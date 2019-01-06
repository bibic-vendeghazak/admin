import React from 'react'
import {Paper, Typography, Grid} from "@material-ui/core"

const Settings = () =>
  <Paper style={{padding: 16, maxWidth: 540, margin: "32px auto"}}>
    <Grid container spacing={16}>
      <Grid container item justify="space-between">
        <Typography>Admin oldal verzió:</Typography>
        <Typography>{process.env.REACT_APP_VERSION}</Typography>
      </Grid>
      <Grid container item justify="space-between">
        <Typography>Admin béta:</Typography>
        <Typography component="a" href={process.env.REACT_APP_ADMIN_BETA_URL} rel="noopener noreferrer" target="_blank">{process.env.REACT_APP_ADMIN_BETA_URL}</Typography>
      </Grid>
      <Grid container item justify="space-between">
        <Typography>Weblap béta:</Typography>
        <Typography component="a" href={process.env.REACT_APP_WEBSITE_BETA_URL} rel="noopener noreferrer" target="_blank">{process.env.REACT_APP_WEBSITE_BETA_URL}</Typography>
      </Grid>
    </Grid>
  </Paper>

export default Settings