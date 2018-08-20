import React, {Component, Fragment} from "react"
import moment from "moment"
import {Link} from "react-router-dom"

import QRCode from 'qrcode-react'
import Address from '@material-ui/icons/LocationCityRounded'
import Done from "@material-ui/icons/DoneRounded"
import Edit from "@material-ui/icons/EditRounded"
import Delete from "@material-ui/icons/DeleteRounded"
import From from "@material-ui/icons/FlightLandRounded"
import To from "@material-ui/icons/FlightTakeoffRounded"
import Tel from "@material-ui/icons/CallRounded"
import Email from "@material-ui/icons/EmailRounded"
import Message from "@material-ui/icons/MessageRounded"
import Home from "@material-ui/icons/HomeRounded"
import Adult from "@material-ui/icons/PeopleRounded"
import Person from "@material-ui/icons/PersonRounded"
import Child from "@material-ui/icons/ChildCareRounded"
import Money from "@material-ui/icons/AttachMoneyRounded"
import Service from "@material-ui/icons/RoomServiceRounded"

import {Tip, Background} from '../../shared'

import {RESERVATIONS_FS, AUTH, getAdminName, TIMESTAMP} from "../../../utils/firebase"
import {routes, colors, toRoute} from "../../../utils"
import {Card, Button, CardActions, Hidden, Divider, CardContent, ListItem, Typography, ListItemIcon, ListItemText, Grid, Tooltip} from "@material-ui/core"

export default class Reservation extends Component {

  state = {
    email: "",
    name: "",
    tel: "",
    message: "",
    handled: false,
    from:  moment(),
    to: moment(),
    roomId: null,
    adults: 1,
    children: [],
    timestamp: moment(),
    price: 1,
    address: "",
    lastHandledBy: ""
  }

  componentDidMount() {
    RESERVATIONS_FS
      .doc(this.props.match.params.reservationId)
      .onSnapshot(snap => this.setState(snap.data()))


    getAdminName(AUTH.currentUser.uid).then(admin => this.setState({admin: admin.val()}))

  }


  handleAccept = () =>
    this.props.openDialog(
      {title: "Biztos jóváhagyja ezt a foglalást?"},
      () => RESERVATIONS_FS.doc(this.props.match.params.reservationId)
        .update({
          handled: true,
          lastHandledBy: this.state.admin,
          timestamp: TIMESTAMP
        }),
      "Foglalás jóváhagyva. A foglaló értesítve lett.",
      () => this.props.history.push(routes.RESERVATIONS)
    )

  handleDelete = () =>
    this.props.openDialog(
      {title: "Biztos törölni akarja ezt a foglalást?"},
      () =>
        RESERVATIONS_FS
          .doc(this.props.match.params.reservationId)
          .delete(),
      "Foglalás törölve. A foglaló értesítve lett.",
      () => this.props.history.push(routes.RESERVATIONS)
    )


  render() {
    const {
      email, name, tel, message, handled, from, to, roomId, adults, children, price, address, timestamp, lastHandledBy, id, activeService
    } = this.state
    const {reservationId} = this.props.match.params
    return (
      <div
        style={{margin: 32}}
      >
        <Card>
          <CardContent>
            <Grid
              container
              justify="space-between"
            >
              <Typography
                color="textSecondary"
                gutterBottom
              >
                #{id}
              </Typography>
              <Tooltip title="Utoljára módosította • Módosítás dátuma">
                <Typography
                  align="right"
                  color="textSecondary"
                  gutterBottom
                >
                  {`${lastHandledBy !== "" ? `${lastHandledBy} • ` : ""} ${moment((timestamp || moment()).toDate()).fromNow()}`}
                </Typography>
              </Tooltip>
            </Grid>
            <Typography>Személyi adatok</Typography>
            <Grid container>
              <Grid
                container
                item
                lg={9}
              >

                <Grid
                  container
                  spacing={8}
                >
                  <Grid
                    item
                    md={4}
                    sm={6}
                    xs={12}
                  >
                    <ListItem>
                      <ListItemIcon><Person/></ListItemIcon>
                      <ListItemText
                        primary={name}
                        secondary="név"
                      />
                    </ListItem>
                  </Grid>
                  <Grid
                    item
                    md={4}
                    sm={6}
                    xs={12}
                  >
                    <ListItem>
                      <ListItemIcon><Email/></ListItemIcon>
                      <ListItemText
                        primary={<a href={`mailto:${email}?subject=Foglalás #${id}&body=Tisztelt ${name}!`}>{email}</a>}
                        secondary="e-mail"
                      />
                    </ListItem>
                  </Grid>
                  <Grid
                    item
                    md={4}
                    sm={6}
                    xs={12}
                  >
                    <ListItem>
                      <ListItemIcon><Tel/></ListItemIcon>
                      <ListItemText
                        primary={<a href={`tel:${tel}`}>{tel}</a>}
                        secondary="telefonszám"
                      />
                    </ListItem>
                  </Grid>
                  <Grid
                    item
                    md={4}
                    sm={6}
                    xs={12}
                  >
                    <ListItem>
                      <ListItemIcon><Address/></ListItemIcon>
                      <ListItemText
                        primary={address}
                        secondary="lakcím"
                      />
                    </ListItem>
                  </Grid>
                  <Grid
                    item
                    md={6}
                    xs={12}
                  >
                    <ListItem>
                      <ListItemIcon><Message/></ListItemIcon>
                      <ListItemText
                        primary={message}
                        secondary="megjegyzés"
                      />
                    </ListItem>
                  </Grid>
                </Grid>
                <Typography>Egyéb részletek</Typography>
                <Grid container>
                  <Grid
                    item
                    md={4}
                    sm={6}
                  >
                    <ListItem>
                      <ListItemIcon><From/></ListItemIcon>
                      <Tooltip title={moment(from.toDate()).format("LLL")}>
                        <ListItemText
                          primary={moment(from.toDate()).format("MMM. D.")}
                          secondary="érkezés"
                        />
                      </Tooltip>
                    </ListItem>
                  </Grid>
                  <Grid
                    item
                    md={4}
                    sm={6}
                  >
                    <ListItem>
                      <ListItemIcon><To/></ListItemIcon>
                      <Tooltip title={moment(to.toDate()).format("LLL")}>
                        <ListItemText
                          primary={moment(to.toDate()).format("MMM. D.")}
                          secondary="távozás"
                        />
                      </Tooltip>
                    </ListItem>
                  </Grid>

                  <Grid
                    item
                    md={4}
                    xs={6}
                  >
                    <ListItem>
                      <ListItemIcon><Adult/></ListItemIcon>
                      <ListItemText
                        primary={`${adults} fő`}
                        secondary="felnőtt"
                      />
                    </ListItem>
                  </Grid>
                  <Grid
                    item
                    md={4}
                    xs={6}
                  >
                    <ListItem>
                      <ListItemIcon><Child/></ListItemIcon>
                      <Tooltip title={
                        <Fragment>
                          {children.length && children.map(({
                            name, count
                          }) =>
                            <span key={name}>{name} éves korig: {count} fő<br/></span>
                          )}
                        </Fragment>
                      }
                      >
                        <ListItemText
                          primary={`${children.reduce((acc, {count}) => acc+count, 0)} fő`}
                          secondary="gyerek"
                        />
                      </Tooltip>
                    </ListItem>
                  </Grid>
                  <Grid
                    item
                    md={4}
                    sm={6}
                    xs={12}
                  >
                    <ListItem>
                      <ListItemIcon><Home/></ListItemIcon>
                      <Tooltip title="Ugrás a szobához">
                        <ListItemText
                          primary={
                            <Link
                              style={{textDecoration:"none"}}
                              to={toRoute(routes.ROOMS, roomId)}
                            >
                              <Background color={colors[`room${roomId}`]}>
                                {roomId}
                              </Background>
                            </Link>
                          }
                          secondary="szoba"
                        />
                      </Tooltip>
                    </ListItem>
                  </Grid>
                  <Grid
                    item
                    md={4}
                    sm={6}
                    xs={12}
                  >
                    <ListItem>
                      <ListItemIcon><Service/></ListItemIcon>
                      <ListItemText
                        primary={activeService === "breakfast" ? "reggeli" : "félpanzió" }
                        secondary="ellátás"
                      />
                    </ListItem>
                  </Grid>

                  <Grid
                    item
                    md={4}
                    sm={6}
                    xs={12}
                  >
                    <ListItem>
                      <ListItemIcon><Money/></ListItemIcon>
                      <ListItemText
                        primary={price !== 1 ? (price)
                          .toLocaleString("hu-HU", {
                            style: "currency",
                            currency: "HUF",
                            maximumFractionDigits: 0,
                            minimumFractionDigits: 0
                          }) : "Nincs megadva"}
                        secondary="fizetni"
                      />
                    </ListItem>
                  </Grid>
                </Grid>
              </Grid>
              <Grid
                alignItems="flex-end"
                container
                direction="column"
                item
                justify="flex-end"
                lg={3}
              >
                <QRCode
                  size={160}
                  value={
                    toRoute(
                      routes.ROOT,
                      // BUG:  the '/' in routes.RESERVATIONS screws up the toRoute function
                      "foglalasok",
                      reservationId,
                      routes.IS_VALID
                    )
                  }
                />
                <Grid item>
                  <Typography color="textSecondary" >#{reservationId}</Typography>
                </Grid>
              </Grid>
            </Grid>


          </CardContent>
          <Divider/>
          <CardActions>
            {!handled &&
            <Button
              color="primary"
              onClick={this.handleAccept}
              variant="raised"
            >
              <Done/>
              <Hidden xsDown>Elfogad</Hidden>
            </Button>
            }
            <Button
              component={Link}
              to={toRoute(routes.RESERVATIONS, reservationId, routes.EDIT)}
              variant="outlined"
            >
              <Edit/>
              <Hidden xsDown>Szerkeszt</Hidden>
            </Button>
            <Button
              color="secondary"
              onClick={this.handleDelete}
              variant="raised"
            >
              <Delete/>
              <Hidden xsDown>Törlés</Hidden>
            </Button>
          </CardActions>
        </Card>
        <Tip>
        Amennyiben a vendég felmutatja az e-mailben kapott QR-kódot, a beolvasás után kapott linkre kattintva az admin oldal megmondja, hogy a foglalás szerepel-e az adatbázisban.
        </Tip>
      </div>
    )
  }
}

