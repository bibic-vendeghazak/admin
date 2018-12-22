import React, {Component} from 'react'
import moment from "moment"
import {Card, CardContent, Grid, Typography, Tooltip, CardActions, Button} from '@material-ui/core'
import {MESSAGES_FS, TIMESTAMP} from "../../lib/firebase"
import {withStore} from "../../db"

import MessageIcon from "@material-ui/icons/MessageRounded"
import Tel from "@material-ui/icons/CallRounded"
import Email from "@material-ui/icons/EmailRounded"
import Person from "@material-ui/icons/PersonRounded"
import Subject from "@material-ui/icons/SubjectRounded"

import {Item} from "../../components/shared"
import {translateSubject} from '../../utils/language'

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
      async () => await MESSAGES_FS.doc(this.state.id).delete(),
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
      accepted, id, timestamp, lastHandledBy, name, email, tel, subject, content
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
              primary={translateSubject(subject)}
              secondary="téma"
            />
            <Item
              icon={<MessageIcon/>}
              primary={content}
              secondary="üzenet"
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