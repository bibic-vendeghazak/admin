import React, {Component, Fragment} from "react"
import {Link} from "react-router-dom"
import moment from "moment"
import {RESERVATIONS, CALENDAR} from "../../../utils/routes"
import {DB, RESERVATIONS_FS} from "../../../utils/firebase"

import {
  Card,
  CardHeader,
  CircularProgress,
  Table,
  TableBody,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from "material-ui"
import LinkIcon from "material-ui/svg-icons/content/link"
import {Tip} from "../../shared"


export default class DayBig extends Component {

  state = {
    reservations: {},
    date: null,
    hasNoDates: false
  }


  componentDidMount() {
    const {
      year, month, day
    } = this.props.match.params
    const date = moment()
      .year(year)
      .month(month-1)
      .date(day)

    this.updateActiveReservations(date)
    window.addEventListener("keyup", this.handleKeyUp, false)
  }

  UNSAFE_componentWillReceiveProps = ({match: {params: {
    year, month, day
  }}}) => {

    this.updateActiveReservations(
      moment()
        .year(year)
        .month(month-1)
        .date(day)
    )
  }

  componentWillUnmount() {
    window.removeEventListener("keyup", this.handleKeyUp, false)
  }

  handleKeyUp = ({keyCode}) => {

    const {
      year, month, day
    } = this.props.match.params
    const date = moment()
      .year(year)
      .month(parseInt(month, 10)-1)
      .date(day)

    switch (keyCode) {
    case 27:
      this.props.history
        .push(`${CALENDAR}/${date.clone().format("YYYY/MM")}`)
      break
    case 37:
    case 39:
      const newDate = date.clone()
        .add((keyCode === 39 ? 1 : -1), "day")
        .format("YYYY/MM/DD")

      this.props.history.push(`${CALENDAR}/${newDate}`)
      break
    default:
      break
    }
  }


  updateActiveReservations = date => {
    this.setState({reservations: {}})
    DB.ref(`reservationDates/${date.clone().format("YYYY/MM/DD")}`)
      .once("value")
      .then(snap => {
        if (snap.exists()) {

          this.setState({hasNoDates: false})
          snap.forEach(reservation =>
            Object.keys(reservation.val()).forEach(reservationId =>
              RESERVATIONS_FS
                .doc(reservationId).get()
                .then(reservation =>
                  this.setState(({reservations}) => ({reservations: {
                    ...reservations,
                    [reservationId]: reservation.data()
                  }}))
                ))
          )
        } else this.setState({hasNoDates: true})
      })
      .then(() => this.setState({date: date.clone().format("MMMM DD, dddd")}))
      .catch(e => console.error(e))
  }


  render() {
    const {
      reservations, hasNoDates
    } = this.state
    const reservationKeys = Object.keys(reservations)
    return (
      <Fragment>

        <Card className="day-big">
          <CardHeader
            style={{textTransform: "capitalize"}}
            title={this.state.date}
          />
          <Table style={{tableLayout: "auto"}}>
            <TableBody
              displayRowCheckbox={false}
              showRowHover
            >
              <TableRow>
                <TableHeaderColumn
                  style={{width: 48}}
                >Szoba</TableHeaderColumn>
                <TableHeaderColumn >Érkezés / Távozás</TableHeaderColumn>
                <TableHeaderColumn style={{textAlign: "right"}} >Foglalás</TableHeaderColumn>
              </TableRow>
              {reservationKeys.length !== 0 ? reservationKeys.map(key => {
                const {
                  from, to, roomId
                } = reservations[key]
                return (
                  <TableRow {...{key}}>
                    <TableRowColumn
                      className={`room-day-big room-${roomId}`}
                      style={{
                        width: 48,
                        textAlign: "center",
                        color: "white"
                      }}
                    >
                      {roomId}
                    </TableRowColumn>
                    <TableRowColumn>
                      {moment(from.seconds*1000 || from).format("MMMM D.")} / {moment(to.seconds*1000 || to).format("MMMM D.")}
                    </TableRowColumn>
                    <TableRowColumn >
                      <Link
                        className="reservation-link"
                        style={{
                          fontWeight: "bold",
                          display: "flex",
                          alignItems:"center",
                          justifyContent: "flex-end"
                        }}
                        to={`${RESERVATIONS}?kezelt=igen&keres=${key}`}
                      >
                        <LinkIcon color="orangered"/>
                      </Link>
                    </TableRowColumn>
                  </TableRow>
                )
              }) : <TableRow>
                <TableRowColumn
                  colSpan={3}
                  style={{
                    padding: 16,
                    textAlign: "center"
                  }}
                >
                  {hasNoDates ?
                    "Nincs foglalás." :
                    <CircularProgress/>
                  }
                </TableRowColumn>
              </TableRow>
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

