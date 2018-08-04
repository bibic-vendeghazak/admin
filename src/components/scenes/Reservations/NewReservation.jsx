import React, {Component, Fragment} from "react"
import { Route, Link } from "react-router-dom"
import moment from "moment"

import {RESERVATIONS_FS, TIMESTAMP, AUTH, ADMINS} from "../../../utils/firebase"

import {
	FloatingActionButton,
	Toggle,
	DatePicker,
	TextField
} from "material-ui"
import Booking from "material-ui/svg-icons/action/bookmark-border"

import {ModalDialog} from "../../shared"
import {isValidReservation} from "../../../utils"
import { RESERVATIONS } from "../../../utils/routes"


const NewReservation = () => (
	<Fragment>
		<Route exact 
			path={`${RESERVATIONS}/uj`}
			render={({history}) => <NewReservationDialog {...{history}}/>}
		/>
		<Link to={`${RESERVATIONS}/uj`}>
			<NewReservationFAB/>
		</Link>
	</Fragment>
)

class NewReservationDialog extends Component {

	state = {
		isFullReservation: false,
		reservation: {
			message: "🤖 admin által felvéve",
			name: "",
			roomId: "",
			tel: "000-000-000",
			email: "email@email.hu",
			address: "cím",
			adults: 1,
			children: [],
			from: moment().toDate(),
			to: moment().add(1, "day").toDate(),
			handled: true,
			activeService: "breakfast",
			price: 1
		}
	}

	componentDidMount() {
		window.addEventListener("keyup", this.handleKeyUp, false)
	}
	componentWillUnmount() {
		window.removeEventListener("keyup", this.handleKeyUp, false)
	}

	handleKeyUp = ({keyCode}) => {
		switch (keyCode) {
		case 27:
			this.handleClose()
			break
		case 13:
			this.handleSubmit()
			break
		default:
			break
		}
	}

	handleInputChange = ({target: {name, value}}) => {
		this.setState(({reservation}) => ({
			reservation: {
				...reservation,
				[name]: parseInt(value, 10) || value 
			}
		}))
	}

	handleDateChange = (type, value) => {
		this.setState(({reservation}) => ({
			reservation: {
				...reservation,
				[type]: type==="from" ? moment(value).hours(14).valueOf() : moment(value).hours(10).valueOf(),
				to: type==="from" ? moment(value).add(1, "day").hours(10).valueOf() : moment(value).hours(10).valueOf()
			}
		}))
	}


	handleSubmit = () => {
		const {reservation} = this.state
		ADMINS.child(AUTH.currentUser.uid).once("value", snap => {
			reservation.timestamp = TIMESTAMP
			reservation.lastHandledBy = snap.val().name
			if (isValidReservation(reservation)) {
				RESERVATIONS_FS
					.add(reservation)
					.then(this.handleClose)
					.catch(e => console.error(e))

			} else {
				// NOTE: Add notifications on invalid reservation
				console.log("Invalid reservation", this.state.reservation)
			}
		})
	}

	handleClose = () => this.props.history.push(RESERVATIONS)

	handleComplexityChange = () => 
		this.setState(({isFullReservation}) => ({
			isFullReservation: !isFullReservation
		}))

	render() {
		const {isFullReservation} = this.state
		const {
			name, tel, email,
			roomId, adults, children,
			from, to, message, address, price
		} = this.state.reservation
		return (
			<ModalDialog open autoScrollBodyContent
				contentStyle={{width: "90%"}}
				submitLabel="Foglalás felvétele"
				onSubmit={this.handleSubmit}
				onCancel={this.handleClose}
			>
				<div className="new-reservation-header">
					<label htmlFor="complexity-change">
						{isFullReservation ? "Teljes" : "Egyszerű"}
					</label>
					<Toggle
						id="complexity-change"
						value={isFullReservation}
						onToggle={this.handleComplexityChange}
					/>
				</div>
				<div className="form-group">
					<TextField
						onChange={this.handleInputChange}
						name="name"
						value={name}
						floatingLabelText="Foglaló neve"
					/>
					<TextField
						onChange={this.handleInputChange}
						name="roomId"
						value={roomId}
						type="number"
						floatingLabelText="Szobaszám"
					/>
				</div>
				<div className="form-group">
					<DatePicker autoOk
						onChange={(e, date) => this.handleDateChange("from", date)}
						value={moment(from).toDate()}
						floatingLabelText="Érkezés"
					/>
					<DatePicker autoOk
						onChange={(e, date) => this.handleDateChange("to", date)}
						value={moment(to).toDate()}
						floatingLabelText="Távozás"
					/>
				</div>
				{isFullReservation && <Fragment>
					<div className="form-group">
						<TextField
							onChange={this.handleInputChange}
							name="tel"
							value={tel}
							floatingLabelText="Foglaló telefonszáma"
						/>
						<TextField
							onChange={this.handleInputChange}
							name="email"
							value={email}
							floatingLabelText="Foglaló e-mail címe"
						/>
						<TextField
							onChange={this.handleInputChange}
							name="message"
							value={message}
							floatingLabelText="Megjegyzés"
						/>
						<TextField
							onChange={this.handleInputChange}
							name="address"
							value={address}
							floatingLabelText="Foglaló címe"
						/>
					</div>
					<div className="form-group">
						<TextField
							onChange={this.handleInputChange}
							type="number"
							name="adults"
							value={adults}
							floatingLabelText="Felnőttek száma"
						/>
						<div style={{display: "flex"}}>
							<TextField
								onChange={this.handleChildrenChange}
								type="number"
								value={children.length}
								floatingLabelText="Gyerekek száma"
							/>
						</div>
						<div style={{display: "flex"}}>
							<TextField
								onChange={this.handleInputChange}
								type="price"
								value={price}
								floatingLabelText="Ár"
							/>
						</div>
					</div>
				</Fragment>}
			</ModalDialog>
		)
	}
}


export const NewReservationFAB = ({openNewReservation}) => (
	<div 
		className="new-reservation-btn">
		<FloatingActionButton 
			title="Foglalás felvétele"
			onClick={openNewReservation}
			secondary
		>
			<Booking/>
		</FloatingActionButton>
	</div>
)


export default NewReservation