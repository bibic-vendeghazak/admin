import React, {Component} from "react"
import {moment} from "../../lib"
import {routes, toRoute} from "../../utils"
import {RESERVATIONS_FS, RESERVATION_DATES_DB} from "../../lib/firebase"

import {
  Card,
  Table,
  TableBody
} from "@material-ui/core"
import {
  EmptyTableBody, Tip, Loading
} from "../../components/shared"

import TableHead from '../Reservations/TableHead'
import FilteredReservations from '../Reservations/FilteredReservations'


export default class DayBig extends Component {

  state = {
    reservations: [],
    date: null,
    noReservation: false
  }

  componentDidMount() {
    const {
      year, month, day
    } = this.props.match.params
    this.fetchReservations(moment([year, month, day].join("-")))


    window.addEventListener("keyup", this.handleKeyUp, false)
  }


  componentWillUnmount() {
    window.removeEventListener("keyup", this.handleKeyUp, false)
  }


  /**
   * @param {moment} date Which day's reservations should be fetched
   * @returns {null} -
   */
  fetchReservations = date => {
    this.setState({noReservation: false,
      reservations: []})
    RESERVATION_DATES_DB.child(date.format("YYYY/MM/DD")).once("value", snap => {
      if (snap.exists()) {
        Object.values(snap.val()).forEach(room =>
          RESERVATIONS_FS
            .doc(Object.keys(room)[0])
            .get()
            .then(
              reservation => this.setState(({reservations}) => ({reservations: [
                ...reservations,
                {key: reservation.id,
                  ...reservation.data()}
              ]})
              ))
        )
      } else {
        this.setState({noReservation: true,
          reservations: []})
      }
    })
  }

  handleKeyUp = ({keyCode}) => {

    const {
      year, month, day
    } = this.props.match.params

    const date = moment([year, month, day].join("-"))
    const newDate = date.clone()
      .add((keyCode === 39 ? 1 : -1), "day")

    switch (keyCode) {
    // ESC will return to the month view
    case 27:
      this.props.history.push(toRoute(routes.CALENDAR, date.clone().format("YYYY/MM")))
      break
      // <- or -> will jump to the corresponding day
    case 37:
    case 39:
      this.fetchReservations(newDate)
      this.props.history.push(toRoute(routes.CALENDAR, newDate.clone().format("YYYY/MM/DD")))
      break
    default:
      break
    }
  }


  render() {
    const {reservations, noReservation} = this.state
    return (
      <>
        <Card>
          <Table>
            <TableHead/>
            <TableBody>
              {reservations.length ?
                <FilteredReservations
                  handledReservations={reservations}
                  unhandledReservations={[]}
                /> :
                <EmptyTableBody title={<Loading isEmpty={noReservation}/>}/>
              }
            </TableBody>

          </Table>
        </Card>
        <Tip>
          Előző nap - ← | Következő nap - → | Esc - Vissza a naptárra
        </Tip>
      </>
    )
  }
}

