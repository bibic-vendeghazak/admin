import React, {Component} from "react"
import {Link} from "react-router-dom"
import moment from "moment"
import {Card, CardHeader} from "material-ui/Card"
import {
	Table,
	TableBody,
	TableHeaderColumn,
	TableRow,
	TableRowColumn,
} from "material-ui/Table"
import LinkIcon from "material-ui/svg-icons/content/link"
import {RESERVATIONS, EDIT, CALENDAR} from "../../../utils/routes"
import {DB, RESERVATIONS_FS} from "../../../utils/firebase"
import { CircularProgress } from "material-ui"


export default class DayBig extends Component {

  state = {
    reservations: {},
    date: null
  }

  handleKeyUp = e => e.keyCode === 27 && this.props.history.goBack()
  
  componentDidMount() {
    const {year, month, day} = this.props.match.params
    this.updateActiveReservations(year, month, day)
    this.setState({
      date: moment([year, month, day].join("-")).format('MMMM DD, dddd')
    })
    window.addEventListener("keyup", this.handleKeyUp, false) 
  }

  componentWillUnmount() {
    window.removeEventListener("keyup", this.handleKeyUp, false)
  }

  componentWillReceiveProps = ({match: {params: {year, month, day}}}) => {
    this.updateActiveReservations(year, month, day)
  }

  updateActiveReservations = (year, month, day) => {
    db.ref(`reservationDates/${year}/${month}/${day}`)
    .once("value").then(snap => {
      snap.forEach(reservation => {
        db.ref(`reservations/${reservation.val()}`)
          .once("value")
          .then(snap => {
            this.setState(({reservations: prevReservations}) => ({
              reservations: {
                ...prevReservations,
                [snap.key]: snap.val()
              }
            }))
          })
      })
    })
  }

  
  render() {
    const {reservations} = this.state
    return (
      <Card className="day-big">
        <CardHeader 
          style={{textTransform: "capitalize"}}
          title={this.state.date}
        />
        <Table style={{tableLayout: "auto"}}>
          <TableBody showRowHover displayRowCheckbox={false}>
          <TableRow>
            <TableHeaderColumn colSpan={1}>Szoba</TableHeaderColumn>
            <TableHeaderColumn colSpan={2}>Érkezés / Távozás</TableHeaderColumn>
            <TableHeaderColumn style={{textAlign: "right"}} colSpan={4}>Foglalás</TableHeaderColumn>
          </TableRow>
            {Object.keys(reservations).map(key => {
              const {from, to, roomId} = reservations[key]
              return (
                <TableRow {...{key}}>
                  <TableRowColumn
                      colSpan={1}
                      style={{width: 48, textAlign: "center", color: "white"}} 
                      className={`room-day-big room-${roomId}`}
                  >
                    {roomId}
                  </TableRowColumn>
                  <TableRowColumn colSpan={2}>
                    {moment(from).format('MMMM D.')} / {moment(to).format('MMMM D.')}
                  </TableRowColumn>
                  <TableRowColumn colSpan={4}>
                    <Link className="reservation-link" 
                      style={{
                        fontWeight: "bold",
                        display: "flex",
                        alignItems:"center",
                        justifyContent: "flex-end"
                        }}
                        to={`${RESERVATIONS}/${key}`}
                    >
                      <LinkIcon color="orangered"/>
                    </Link>
                  </TableRowColumn>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Card>
    )
  }
}

