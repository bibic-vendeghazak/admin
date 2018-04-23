import React, {Component} from "react"
import moment from "moment"
import {ADMINS} from "../../../utils/firebase"

import {DatePicker, DropDownMenu, Subheader} from "material-ui"
import TextField from "material-ui/TextField/TextField"

import {RESERVATIONS_FS, AUTH, TIMESTAMP} from "../../../utils/firebase"
import {ModalDialog} from "../../shared"
import MenuItem from "material-ui/MenuItem"
import { RESERVATIONS } from "../../../utils/routes"

class BigReservation extends Component {

  state = {
  	children: [],
  	adults: "",
  	lastHandledBy: "",
  	from: 0,
  	to: 0,
  	roomId: 0
  }

  componentDidMount() {
  	const {reservationId} = this.props.match.params
  	RESERVATIONS_FS.doc(reservationId)
  		.get()
  		.then(snap => this.setState({...snap.data()}))
  		.catch(e => console.err(e))
  	window.addEventListener("keyup", this.handleKeyUp, false)
  }

  handleKeyUp = ({keyCode}) => {
  	switch (keyCode) {
  	case 13:
  		this.handleSubmit()
  		break
  	case 27:
  		this.handleClose()
  		break
  	default:
  		break
  	}
  }
    

  handleClose = () => this.props.history.push(RESERVATIONS)

  handleSubmit = () => {
  	const reservation = this.state
  	ADMINS.child(AUTH.currentUser.uid)
  		.once("value", snap => {
  			reservation.timestamp = TIMESTAMP
  			reservation.lastHandledBy = snap.val().name
				
  			RESERVATIONS_FS.doc(this.props.match.params.reservationId)
  				.update(reservation)
  				.then(this.handleClose)
  				.catch(e => console.err(e))
  		}).catch(e => console.error(e))
		
  }

  handleNumberChange = ({target: {name, value}}) => {
  	this.setState({[name]: parseInt(value, 10) || ""})
  }

  handleChildrenChange = ({target: {name, value}}) => {
  	const newChildren = Array(parseInt(value, 10)|| 0).fill("6-12")
  	this.setState({children: newChildren})
  }

  handleRoomChange = roomId => this.setState({roomId})

  handleDateChange = (date, type) => {
  	this.setState({
  		[type]: moment(date).hours(type === "from" ?  14 : 10).unix() * 1000
  	})
  }

  render() {
  	const {children, adults, from, to, roomId} = this.state
  	const {rooms} = this.props
    
  	return (

  		<ModalDialog open
  			submitLabel="Mentés"
  			contentStyle={{maxWidth: 480}}
  			onCancel={this.handleClose}
  			onSubmit={this.handleSubmit}
  		>
  			<Subheader>Foglalás szerkesztése</Subheader>
  			<div
  				style={{
  					display: "flex",
  					flexDirection: "column"
  				}}
  			>
  				<div className="dialog-field">
  					<label htmlFor="roomId">Szobaszám</label>
  					<DropDownMenu
  						name="roomId"
  						value={roomId}
  						onChange={(e, t, v) => this.handleRoomChange(v)}
  					>
  						{rooms.map((room,index) => {
  							const roomId = index+1
  							return (
  								<MenuItem
  									key={roomId}
  									value={roomId}
  									primaryText={roomId}
  								/>
  							)
  						})}
  					</DropDownMenu>
  				</div>
  				<div className="dialog-field">
  					<label htmlFor="adults">Felnőtt</label>
  					<TextField
  						style={{maxWidth: 120}}
  						onChange={this.handleNumberChange}
  						name="adults"
  						value={adults}
  					/>
  				</div>
  				<div className="dialog-field">
  					<label htmlFor="children">Gyerek</label>
  					<TextField
  						style={{maxWidth: 120}}
  						name="children"
  						onChange={this.handleChildrenChange}
  						value={children.length}
  					/>
  				</div>
  				<div className="dialog-field">
  					<label htmlFor="from">Érkezés</label>
  					<DatePicker autoOk
  						textFieldStyle={{maxWidth: 120}}
  						name="from"
  						onChange={(e, date) => this.handleDateChange(date, "from")}
  						value={moment(from).toDate()}
  					/>
  				</div>
  				<div className="dialog-field">
  					<label htmlFor="to">Távozás</label>
  					<DatePicker autoOk
  						textFieldStyle={{maxWidth: 120}}
  						name="to"
  						onChange={(e, date) => this.handleDateChange(date, "to")}
  						value={moment(to).toDate()}
  					/>
  				</div>
  			</div>
  		</ModalDialog>
  	)
  }
}


export default BigReservation