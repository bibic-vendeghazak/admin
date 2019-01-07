import React, {Component} from 'react'
import {Paper, Typography, Grid} from "@material-ui/core"

export default class Settings extends Component {
  state = {
    backup: {
      admins: true, //NOTE: Leave it on true!
      reservations: false, // with reservationDates
      messages: false,
      feedbacks: false, // feedbacks(FS), feedback averages (DB)
      bemutatkozas: false,
      tanusitvanyok: false, // gallery, paragraph
      rooms: false, // gallery (szobak), roomServices
      etelek: false,
      rendezvenyek: false,
      szolgaltatasaink: false
    }
  }

  render() {
    return (
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
    )
  }
}