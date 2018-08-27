import React, {Component, Fragment} from "react"
import {Route, Link} from "react-router-dom"
import moment from "moment"

import {RESERVATIONS_FS, TIMESTAMP, AUTH, ADMINS} from "../../../utils/firebase"

import {
  FloatingActionButton,
  Toggle,
  DatePicker,
  TextField
} from "material-ui"
import Booking from "material-ui/svg-icons/action/bookmark-border"

import {Modal} from "../../shared"
import {isValidReservation} from "../../../utils"
import {RESERVATIONS} from "../../../utils/routes"
import {withStore} from "../../App/Store"


const NewReservation = () => (
  <Fragment>
    <Route
      exact
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

  handleInputChange = ({target: {
    name, value
  }}) => {
    this.setState(({reservation}) => ({reservation: {
      ...reservation,
      [name]: parseInt(value, 10) || value
    }}))
  }

  handleDateChange = (type, value) => {
    this.setState(({reservation}) => ({reservation: {
      ...reservation,
      [type]: type==="from" ? moment(value).hours(14).valueOf() : moment(value).hours(10).valueOf(),
      to: type==="from" ? moment(value).add(1, "day").hours(10).valueOf() : moment(value).hours(10).valueOf()
    }}))
  }


  handleSubmit = () => {
    const {reservation} = this.state
    ADMINS.child(AUTH.currentUser.uid).once("value", snap => {
      reservation.timestamp = TIMESTAMP
      reservation.lastHandledBy = snap.val().name
      if (isValidReservation(reservation)) {
        RESERVATIONS_FS
          .doc(`${moment(reservation.from).format("YYYYMMDD")}-sz${reservation.roomId}`)
          .set(reservation)
          .then(this.handleClose)
          .catch(console.error)

      } else {
        // NOTE: Add notifications on invalid reservation
        console.log("Invalid reservation", this.state.reservation)
      }
    })
  }

  handleClose = () => this.props.history.push(RESERVATIONS)

  handleComplexityChange = () =>
    this.setState(({isFullReservation}) => ({isFullReservation: !isFullReservation}))

  render() {
    const {isFullReservation} = this.state
    const {
      name, tel, email,
      roomId, adults, children,
      from, to, message, address, price
    } = this.state.reservation
    return (
      <Modal
        autoScrollBodyContent
        contentStyle={{width: "90%"}}
        onCancel={this.handleClose}
        onSubmit={this.handleSubmit}
        open
        submitLabel="Foglalás felvétele"
      >
        <div className="new-reservation-header">
          <label htmlFor="complexity-change">
            {isFullReservation ? "Teljes" : "Egyszerű"}
          </label>
          <Toggle
            id="complexity-change"
            onToggle={this.handleComplexityChange}
            value={isFullReservation}
          />
        </div>
        <div className="form-group">
          <TextField
            floatingLabelText="Foglaló neve"
            name="name"
            onChange={this.handleInputChange}
            value={name}
          />
          <TextField
            floatingLabelText="Szobaszám"
            name="roomId"
            onChange={this.handleInputChange}
            type="number"
            value={roomId}
          />
        </div>
        <div className="form-group">
          <DatePicker
            autoOk
            floatingLabelText="Érkezés"
            onChange={(e, date) => this.handleDateChange("from", date)}
            value={moment(from).toDate()}
          />
          <DatePicker
            autoOk
            floatingLabelText="Távozás"
            onChange={(e, date) => this.handleDateChange("to", date)}
            value={moment(to).toDate()}
          />
        </div>
        {isFullReservation && <Fragment>
          <div className="form-group">
            <TextField
              floatingLabelText="Foglaló telefonszáma"
              name="tel"
              onChange={this.handleInputChange}
              value={tel}
            />
            <TextField
              floatingLabelText="Foglaló e-mail címe"
              name="email"
              onChange={this.handleInputChange}
              value={email}
            />
            <TextField
              floatingLabelText="Megjegyzés"
              name="message"
              onChange={this.handleInputChange}
              value={message}
            />
            <TextField
              floatingLabelText="Foglaló címe"
              name="address"
              onChange={this.handleInputChange}
              value={address}
            />
          </div>
          <div className="form-group">
            <TextField
              floatingLabelText="Felnőttek száma"
              name="adults"
              onChange={this.handleInputChange}
              type="number"
              value={adults}
            />
            <div style={{display: "flex"}}>
              <TextField
                floatingLabelText="Gyerekek száma"
                onChange={this.handleChildrenChange}
                type="number"
                value={children.length}
              />
            </div>
            <div style={{display: "flex"}}>
              <TextField
                floatingLabelText="Ár"
                onChange={this.handleInputChange}
                type="price"
                value={price}
              />
            </div>
          </div>
        </Fragment>}
      </Modal>
    )
  }
}


export const NewReservationFAB = ({openNewReservation}) => (
  <div
    className="new-reservation-btn"
  >
    <FloatingActionButton
      onClick={openNewReservation}
      secondary
      title="Foglalás felvétele"
    >
      <Booking/>
    </FloatingActionButton>
  </div>
)


export default withStore(NewReservation)