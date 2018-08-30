import React, {Component} from 'react'
import moment from "moment"
import {Card, CardContent, Grid, Typography, Tooltip, ListItem, ListItemText, ListItemIcon, CardActions, Button} from '@material-ui/core'
import {SPECIAL_REQUESTS_FS, TIMESTAMP, getAdminName, AUTH} from '../../../utils/firebase'
import {withStore} from "../../App/Store"

import From from "@material-ui/icons/FlightLandRounded"
import Message from "@material-ui/icons/MessageRounded"
import Tel from "@material-ui/icons/CallRounded"
import Email from "@material-ui/icons/EmailRounded"
import Adult from "@material-ui/icons/PeopleRounded"
import Person from "@material-ui/icons/PersonRounded"
import Service from "@material-ui/icons/RoomServiceRounded"
import Subject from "@material-ui/icons/SubjectRounded"
import Admin from "@material-ui/icons/PermIdentityRounded"

class SpecialRequest extends Component {
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
    adminComment: "",
    message: ""
  }

  componentDidMount() {
    SPECIAL_REQUESTS_FS
      .doc(this.props.match.params.specialRequestId)
      .onSnapshot(snap => this.setState({
        id: snap.id,
        ...snap.data()
      }))

    getAdminName(AUTH.currentUser.uid).then(snap => this.setState({admin: snap.val()}))
  }


  handleDelete = () =>
    this.props.openDialog(
      {title: "Biztosan törli ezt az egyedi foglalást"},
      () => SPECIAL_REQUESTS_FS.doc(this.state.id).delete(),
      "Sikeresen törölve.",
      this.props.history.goBack
    )

  handleSubmit = () =>
    this.props.openDialog(
      {title: "Megjelöli kezeltként ezt az egyedi foglalást"},
      () => SPECIAL_REQUESTS_FS.doc(this.state.id).update({
        timestamp: TIMESTAMP,
        lastHandledBy: this.state.admin,
        accepted: true
      }),
      "Megjelölve kezeltként."
    )


  render() {

    const {
      accepted, id, timestamp, lastHandledBy, name, email, tel, subject, from, service, peopleCount, adminComment, message
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
              icon={<Message/>}
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
                <Tooltip title={moment(from.toDate()).format("LLL")}>
                  <span>{moment(from.toDate()).format("YYYY MMM. DD")}</span>
                </Tooltip>
              }
              secondary="időpont"
            />
            <Tooltip title="Csak az admin látja!">
              <Item
                icon={<Admin/>}
                md={6}
                primary={adminComment}
                secondary="admin megjegyzés"
                style={{cursor: "pointer"}}
              />
            </Tooltip>
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


export default withStore(SpecialRequest)