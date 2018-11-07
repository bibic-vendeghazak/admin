import React, {Component} from 'react'
import moment from "moment"
import {Link} from "react-router-dom"
import {Card, CardContent, Grid, Typography, Tooltip, CardActions, Button} from '@material-ui/core'
import {MESSAGES_FS, TIMESTAMP} from "../../lib/firebase"
import {withStore} from "../../db"

import From from "@material-ui/icons/AccessTimeRounded"
import MessageIcon from "@material-ui/icons/MessageRounded"
import Tel from "@material-ui/icons/CallRounded"
import Email from "@material-ui/icons/EmailRounded"
import Adult from "@material-ui/icons/PeopleRounded"
import Person from "@material-ui/icons/PersonRounded"
import Service from "@material-ui/icons/RoomServiceRounded"
import Subject from "@material-ui/icons/SubjectRounded"
import {toRoute, routes} from '../../utils'

import {Item} from "../../components/shared"

class Message extends Component {
  state = {
    name: "",
    accepted: false,
    email: "",
    tel: "",
    subject: "",
    from: moment(),
    timestamp: moment(),
    service: "",
    peopleCount: 0,
    id: "",
    lastHandledBy: "",
    message: ""
  }

  componentDidMount() {
    MESSAGES_FS
      .doc(this.props.match.params.messageId)
      .onSnapshot(snap => this.setState({
        id: snap.id,
        ...snap.data()
      }))
  }


  handleDelete = () =>
    this.props.openDialog(
      {title: "Biztosan törli ezt az egyedi foglalást"},
      () => MESSAGES_FS.doc(this.state.id).delete(),
      "Sikeresen törölve.",
      this.props.history.goBack
    )

  handleSubmit = () => {
    const {
      openDialog, profile
    } = this.props
    openDialog(
      {title: "Megjelöli kezeltként ezt az egyedi foglalást"},
      () => MESSAGES_FS.doc(this.state.id).update({
        timestamp: TIMESTAMP,
        lastHandledBy: profile.name,
        accepted: true
      }),
      "Megjelölve kezeltként."
    )
  }


  render() {

    const {
      accepted, id, timestamp, lastHandledBy, name, email, tel, subject, from, service, peopleCount, message
    } = this.state

    return (
      <Card style={{margin: 32}}>
        <CardContent>
          <Grid container justify="space-between">
            <Typography color="textSecondary">
              #{id}
            </Typography>
            <Tooltip title="Utoljára módosította • Módosítás dátuma">
              <Typography align="right" color="textSecondary" gutterBottom>
                {`${lastHandledBy !== "" ? lastHandledBy : "Még senki"} • ` }
                {moment(timestamp.toDate()).fromNow()}</Typography>
            </Tooltip>
          </Grid>
          <Grid container>
            <Item
              icon={<Person/>}
              primary={name}
              secondary="név"
            />
            <Item
              icon={<Email/>}
              primary={<a href={`mailto:${email}`}>{email}</a>}
              secondary="e-mail"
            />
            <Item
              icon={<Tel/>}
              primary={<a href={`tel:${tel}`}>{tel}</a>}
              secondary="telefon"
            />
            <Item
              icon={<Subject/>}
              primary={subject}
              secondary="rendezvény célja"
            />
            <Item
              icon={<MessageIcon/>}
              primary={message}
              secondary="üzenet"
            />
            <Item
              icon={<Service/>}
              primary={service}
              secondary="igényelt ellátás"
            />
            <Item
              icon={<Adult/>}
              primary={peopleCount}
              secondary="fő"
            />
            <Item
              icon={<From/>}
              primary={
                <Tooltip title="Ugrás a naptárra">
                  <Link
                    to={toRoute(routes.CALENDAR, moment(from.toDate()).format("YYYY/MM/DD"))}
                  >
                    {moment(from.toDate()).format("YYYY. MMMM DD, dddd")}
                  </Link>
                </Tooltip>
              }
              secondary="időpont"
            />
          </Grid>
        </CardContent>
        <CardActions>
          {!accepted ?
            <Button

              color="primary"
              onClick={this.handleSubmit}
              variant="contained"
            >
              Megjelölés kezeltként
            </Button> :
            <Button
              disabled
              variant="contained"
            >
              Kezelve
            </Button>
          }
          <Button
            color="secondary"
            onClick={this.handleDelete}
            variant="contained"
          >
            Törlés
          </Button>
        </CardActions>
      </Card>
    )
  }
}


export default withStore(Message)