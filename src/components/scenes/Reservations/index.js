import React, {Component, Fragment} from "react"
import moment from 'moment'
import {Route, withRouter} from "react-router-dom"
import EditReservation from "./EditReservation"
import {ExtendedFAB, Loading, Tip} from "../../shared"
import {routes, toRoute} from "../../../utils"
import Store from "../../App/Store"
import Reservation from './Reservation'
import FilteredReservations, {EmptyTableBody} from './TableBody'


import {Table, TableBody, Paper} from "@material-ui/core"
import TableHead from './TableHead'

import Bookmark from '@material-ui/icons/BookmarkBorderRounded'

import {RESERVATIONS_FS} from "../../../utils/firebase"
import Validity from "./Validity"
import ReservationsToolbar from "./ReservationsToolbar"


class Reservations extends Component {

  state = {
    isLoading: false,
    handledReservations: null,
    unhandledReservations: null,
    from: moment().add(-1, "week").startOf("day"),
    to: moment().add(2, "months"),
    order: 'desc',
    orderBy: 'timestamp',
    query: [""],
    roomsFilter: null
  }


  componentDidMount() {
    this.getReservations()
  }

  getReservations = () => {
    const {
      from, to
    } = this.state
    Promise.all([
      RESERVATIONS_FS
        .where("handled", "==", false)
        .onSnapshot(snap => {
          const unhandledReservations = []
          snap.forEach(reservation =>
            unhandledReservations
              .push({
                key: reservation.id,
                ...reservation.data()
              })
          )
          this.setState({unhandledReservations})
        }, this.props.sendNotification),
      RESERVATIONS_FS
        .orderBy("from")
        .where("handled", "==", true)
        .startAt(moment(from).toDate())
        .endAt((to ? moment(to) : moment().add(2, "months")).toDate())
        .limit(200)
        .onSnapshot(snap => {
          const handledReservations = []
          snap.forEach(reservation =>
            handledReservations
              .push({
                key: reservation.id,
                ...reservation.data()
              })
          )
          this.setState({handledReservations})
        }, this.props.sendNotification)
    ]).then(() => this.setState({isLoading: false}))
  }


  handleSearchChange = ({target: {value}}) =>
    this.setState({query: value.toLowerCase().split(" ")})


  handleDateChange = ({target: {
    name, value
  }}) => {
    this.setState(() => ({
      isLoading: true,
      [name]: value === "" ? null : value
    }), this.getReservations)
  }

  handleRoomChange = (roomId, roomsFilterLength) => {

    let {roomsFilter} = this.state
    if (!roomsFilter) {
      roomsFilter = Array(roomsFilterLength).fill(true)
    }
    roomsFilter = roomsFilter.map((e, i) => i === roomId ? !e : e)
    this.setState({roomsFilter})
  }

  handleRequestSort = property =>
    this.setState(({
      orderBy, order
    }) => ({
      order: (orderBy === property && order === 'desc') ? "asc" : "desc",
      orderBy: property
    }))


  render() {
    const {
      handledReservations, unhandledReservations, order, orderBy, from, to, query, isLoading, roomsFilter
    } = this.state
    const isFetched = handledReservations && unhandledReservations
    const reservationCount = isFetched && (handledReservations.length + unhandledReservations.length)
    return (
      <Store.Consumer>
        {({
          rooms, openDialog
        }) =>
          <div>
            <Route
              exact
              path={routes.RESERVATIONS}
              render={() =>
                <Fragment>
                  <Paper
                    square
                    style={{marginBottom: 16}}
                  >
                    <ReservationsToolbar
                      onDateChange={this.handleDateChange}
                      onRoomChange={this.handleRoomChange}
                      onSearchChange={this.handleSearchChange}
                      roomsFilter={roomsFilter || Array(rooms.length).fill(true)}
                      {...{
                        query,
                        from,
                        to,
                        reservationCount
                      }}
                    />
                    <Table>
                      <TableHead
                        onRequestSort={this.handleRequestSort}
                        {...{
                          order,
                          orderBy
                        }}
                      />
                      <TableBody>
                        {
                          (isFetched && !isLoading) ?
                            <FilteredReservations
                              {...{
                                query,
                                order,
                                orderBy,
                                handledReservations,
                                unhandledReservations,
                                roomsFilter
                              }}
                            /> :
                            <EmptyTableBody title={<Loading/>}/>
                        }
                      </TableBody>
                    </Table>
                  </Paper>
                  <ExtendedFAB
                    icon={<Bookmark/>}
                    label="Új foglalás"
                    to={toRoute(routes.RESERVATIONS, routes.NEW)}
                  />
                  <Tip>A foglalások sorbarendezhetőek az oszlopcímekre kattintva.</Tip>
                  <Tip>Az új foglalások mindig a lap tetején jelennek meg.</Tip>
                </Fragment>
              }
            />
            <Route
              component={Validity}
              exact
              path={toRoute(routes.RESERVATIONS, ":reservationId", routes.IS_VALID)}
            />
            <Route
              path={toRoute(routes.RESERVATIONS, ":reservationId")}
              render={props =>
                <Reservation {...{
                  openDialog,
                  ...props
                }}
                />
              }
            />
            <Route
              exact
              path={toRoute(routes.RESERVATIONS, ":reservationId", routes.EDIT)}
              render={props =>
                <EditReservation
                  {...{
                    rooms,
                    ...props
                  }}
                  error="A foglalást nem tudtuk frissíteni. Kérjük ellenőrizze az adatokat."
                  isFullReservation
                  promptTitle="Menti a változtatásokat?"
                  sendNotification={this.props.sendNotification}
                  shouldPrompt
                  submitLabel="Mentés"
                  success="Foglalás sikeresen frissítve!"
                  title="Foglalás részletei"
                />
              }
            />
            <Route
              exact
              path={toRoute(routes.RESERVATIONS, routes.NEW)}
              render={props =>
                <EditReservation
                  {...{
                    rooms,
                    ...props
                  }}
                  error="Sikertelen foglalás! Kérjük ellenőrizze az adatokat."
                  promptTitle="Biztosan felveszi ezt a foglalást?"
                  sendNotification={this.props.sendNotification}
                  shouldPrompt
                  submitLabel="Felvétel"
                  success="Foglalás sikeresen felvéve!"
                  title="Foglalás felvétele"
                />
              }
            />
          </div>
        }
      </Store.Consumer>
    )
  }
}


export default withRouter(Reservations)