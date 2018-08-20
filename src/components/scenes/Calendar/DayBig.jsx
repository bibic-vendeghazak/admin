import React, {Component, Fragment} from "react"
import moment from "moment"
import {routes, toRoute} from "../../../utils"
import {RESERVATIONS_FS} from "../../../utils/firebase"

import {
  Card,
  Table,
  TableBody
} from "@material-ui/core"
import {Tip, Loading} from "../../shared"

import TableHead from '../Reservations/TableHead'
import FilteredReservations, {EmptyTableBody} from '../Reservations/TableBody'

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
    date = date.endOf("day").toDate()
    this.setState({reservations: []})
    RESERVATIONS_FS
    // .where("from", "<=", date.toDate())
      .where("to", ">=", date)
      .limit(100)
      .get()
      .then(snap => {
        if (snap.empty) {
          this.setState({
            noReservation: true,
            reservations: []
          })
        } else {
          const reservations = []
          snap.forEach(reservation => {
            const from = moment(reservation.data().from.toDate())
            const to = moment(reservation.data().to.toDate())
            if (moment(date).isBetween(from, to)) {
              reservations.push({
                key: reservation.id,
                ...reservation.data()
              })
            }
          })
          this.setState({
            reservations,
            noReservation: !reservations.length
          })
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
    const {
      reservations, noReservation
    } = this.state
    return (
      <Fragment>
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
      </Fragment>
    )
  }
}

