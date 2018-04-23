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

  handleKeyUp = ({keyCode}) => {
    
  	const {year, month, day} = this.props.match.params
  	const date =  moment()
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

  componentDidMount() {
  	const {year, month, day} = this.props.match.params
  	const date = moment()
  		.year(year)
  		.month(month-1)
  		.date(day)
    
  	this.updateActiveReservations(date)
  	window.addEventListener("keyup", this.handleKeyUp, false) 
  }

  componentWillUnmount() {
  	window.removeEventListener("keyup", this.handleKeyUp, false)
  }

  componentWillReceiveProps = ({match: {params: {year, month, day}}}) => {
    
  	this.updateActiveReservations(
  		moment()
  			.year(year)
  			.month(month-1)
  			.date(day)
  	)
  }

  updateActiveReservations = date => {
    
  	DB.ref(`reservationDates/${date.clone().format("YYYY/MM/DD")}`)
  		.once("value").then(snap => {
  			this.setState({reservations: {}})
  			snap.forEach(reservation =>   
  				RESERVATIONS_FS
  					.doc(reservation.val())
  					.get()
  					.then(snap => 
  						this.setState(({reservations: prevReservations}) => ({
  							reservations: {
  								...prevReservations,
  								[snap.id]: snap.data()
  							}
  						}))).then(() => {
  						this.setState({date: date.clone().format("MMMM DD, dddd")})
  					}))
  		}).catch(e => console.error(e))
  }

  
  render() {
  	const {reservations} = this.state
  	return (
  		<Card className="day-big">
  			<CardHeader 
  				style={{textTransform: "capitalize"}}
  				title={this.state.date}
  			/>
  			{Object.keys(reservations).length ?
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
  										{moment(from).format("MMMM D.")} / {moment(to).format("MMMM D.")}
  									</TableRowColumn>
  									<TableRowColumn colSpan={4}>
  										<Link className="reservation-link" 
  											style={{
  												fontWeight: "bold",
  												display: "flex",
  												alignItems:"center",
  												justifyContent: "flex-end"
  											}}
  											to={`${RESERVATIONS}/${key}/${EDIT}`}
  										>
  											<LinkIcon color="orangered"/>
  										</Link>
  									</TableRowColumn>
  								</TableRow>
  							)
  						})}
  					</TableBody>
  				</Table> :
  				<CircularProgress/>}
  		</Card>
  	)
  }
}

