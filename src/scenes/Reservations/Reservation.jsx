import React, {Component} from "react"
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

import {Tip, Background, Item} from "../../components/shared"

import {RESERVATIONS_FS, TIMESTAMP} from "../../lib/firebase"
import {routes, colors, toRoute} from "../../utils"
import {Card, Button, CardActions, Hidden, Divider, CardContent, Typography, Grid, Tooltip} from "@material-ui/core"
import {withStore} from "../../db"

class Reservation extends Component {

  componentDidMount = async () => {
    const {match:{params: reservationId}} = this.props
    try {
      if (reservationId !== this.props.reservationId) {
        await this.props.fetchReservation(this.props.match.params.reservationId)
      }
    } catch (error) {
      this.props.sendNotification(error)
    }
  }


  handleAccept = () => {
    const {
      openDialog, profile, history, match
    } = this.props
    openDialog(
      {title: "Biztos jóváhagyja ezt a foglalást?"},
      () => RESERVATIONS_FS.doc(match.params.reservationId)
        .update({
          handled: true,
          lastHandledBy: profile.name,
          timestamp: TIMESTAMP
        }),
      "Foglalás jóváhagyva. A foglaló értesítve lett.",
      () => history.push(routes.RESERVATIONS)
    )
  }



  render() {
    const {reservation: {
      email, name, tel, message, handled, from, to, roomId, adults, children,
      price, address, timestamp, lastHandledBy, id, foodService
    }} = this.props
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
                  <Item
                    icon={<Person/>}
                    primary={name}
                    secondary="név"
                  />
                  <Item
                    icon={<Email/>}
                    primary={<a href={`mailto:${email}?subject=Foglalás #${id}&body=Tisztelt ${name}!`}>{email}</a>}
                    secondary="e-mail"
                  />
                  <Item
                    icon={<Tel/>}
                    primary={<a href={`tel:${tel}`}>{tel}</a>}
                    secondary="telefonszám"
                  />
                  <Item
                    icon={<Address/>}
                    primary={address}
                    secondary="lakcím"
                  />
                  <Item
                    icon={<Message/>}
                    md={6}
                    primary={message}
                    secondary="megjegyzés"
                  />
                </Grid>
                <Typography>Egyéb részletek</Typography>
                <Grid container>
                  <Tooltip title="Ugrás a naptárra">
                    <Item
                      icon={<From/>}
                      primary={
                        <Link to={toRoute(routes.CALENDAR, moment(from).format("YYYY/MM/DD"))}>
                          {moment(from).format("MMM. D.")}
                        </Link>
                      }
                      secondary="érkezés"
                    />
                  </Tooltip>
                  <Tooltip title="Ugrás a naptárra">
                    <Item
                      icon={<To/>}
                      primary={
                        <Link to={toRoute(routes.CALENDAR, moment(to).format("YYYY/MM/DD"))}>
                          {moment(to).format("MMM. D.")}
                        </Link>
                      }
                      secondary="távozás"
                    />
                  </Tooltip>
                  <Item
                    icon={<Adult/>}
                    primary={`${adults} fő`}
                    secondary="felnőtt"
                  />
                  <Tooltip
                    title={
                      <>
                        {children.length && children.map(({
                          name, count
                        }) =>
                          <span key={name}>
                            {name} éves korig: {count} fő<br/>
                          </span>
                        )}
                      </>
                    }
                  >
                    <Item
                      icon={<Child/>}
                      primary={`${children.reduce((acc, {count}) => acc+count, 0)} fő`}
                      secondary="gyerek"
                    />
                  </Tooltip>
                  <Tooltip title="Ugrás a szobához">
                    <Item
                      icon={<Home/>}
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
                  <Item
                    icon={<Service/>}
                    primary={foodService === "breakfast" ? "reggeli" : "félpanzió" }
                    secondary="ellátás"
                  />
                  <Item
                    icon={<Money/>}
                    primary={price !== 1 ? (price)
                      .toLocaleString("hu-HU", {
                        style: "currency",
                        currency: "HUF",
                        maximumFractionDigits: 0,
                        minimumFractionDigits: 0
                      }) : "Nincs megadva"}
                    secondary="fizetni"
                  />
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
              variant="contained"
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
              component={Link}
              to={toRoute(routes.RESERVATIONS, reservationId, routes.DELETE)}
              variant="contained"
            >
              <Delete/>
              <Hidden xsDown>Törlés</Hidden>
            </Button>
          </CardActions>
        </Card>
        <Tip>
          Amennyiben a vendég felmutatja az e-mailben kapott QR-kódot,
          a beolvasás után kapott linkre kattintva az admin oldal megmondja,
          hogy a foglalás szerepel-e az adatbázisban.
        </Tip>
      </div>
    )
  }
}


export default withStore(Reservation)