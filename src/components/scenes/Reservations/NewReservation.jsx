import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import firebase from 'firebase'
import moment from 'moment'

import FloatingActionButton from 'material-ui/FloatingActionButton'
import FlatButton from 'material-ui/FlatButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import TextField from 'material-ui/TextField'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import DatePicker from 'material-ui/DatePicker'
import TimePicker from 'material-ui/TimePicker'
import {Stepper, Step, StepLabel} from 'material-ui/Stepper'
import StepContent from 'material-ui/Stepper/StepContent'

import {ModalDialog} from '../../shared'
import {validateEmail, validateName, validateTel} from '../../../utils'


export default class NewReservation extends Component {

  state = {
    open: false
  }

  openNewReservation = () => this.setState({open: true})
  closeNewReservation = () => this.setState({open: false})

  render() {
    const {open} = this.state
    return (
      <div>
        <NewReservationDialog {...{open}}
          closeNewReservation={this.closeNewReservation}
        />
        <NewReservationFAB openNewReservation={this.openNewReservation}/>
      </div>
    )
  }
}

class NewReservationDialog extends Component {

  state = {
    onSubmitDisabled: false, 
    name: "",
    email: "",
    tel: "",
    message: null,
    roomId: 3,
    adults: 1,
    children: 0,
    from: null,
    to: null,
    stepIndex: 0,
    focusedField: null,
    errorType: "",
    errorMessage: ""
  }

  submitNewReservation = () => {
    // this.props.submitNewReservation()
    let {
      name, email, tel, message, 
      roomId, adults, children,
      from, to
    } = this.state
    message = message || "Nincs üzenet"
    const reservationsRef = firebase.database().ref("reservations")
    reservationsRef.push().then(snap => {
      const {key} = snap
      const metadata = {roomId, from: moment(from).unix()*1000, to: (moment(to).unix()*1000), handled: false}
      const details = {name, email, tel, message, adults, children}
      reservationsRef.child(key).set({
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        lastHandledBy: firebase.auth().currentUser.uid,
        metadata, details
      }).then(() => this.props.closeNewReservation())
    })
  }

  focusChange = focusedField => this.setState({focusedField})

  handleValueChange = (value, type) => {
    const {focusedField} = this.state
    let isValid = false
    let errorMessage
    switch(focusedField) {
      case "email":
        isValid = validateEmail(value)
        errorMessage = "Érvénytelen E-mail"
        break
      case "name":
        isValid = validateName(value)
        errorMessage = "Érvénytelen név"
        break
      case "tel":
        isValid = validateTel(value)
        errorMessage = "Érvénytelen név"
        break
      default:
       isValid = true
       errorMessage = ""
    }
    
    this.setState({
      [type]: type === "number" ? parseInt(value, 10) : value
    })

    if (isValid) {
      this.setState({
        errorType: "",
        errorMessage: ""
      })
    } else {
      this.setState({
         errorType: focusedField,
         errorMessage
      })
    }
    
  }


  handleNext = () => {
    const {stepIndex} = this.state
    stepIndex < 5 && this.setState({stepIndex: stepIndex + 1})
  }

  handlePrev = () => {
    const {stepIndex} = this.state
    stepIndex > 0 && this.setState({stepIndex: stepIndex - 1})
  }

  // NOTE: Admin can change reservations in past. 
  // Check out the corresponding DatePicker.
  shouldDisableFromDate = date => moment(date).unix() < moment().startOf("day").unix()
  shouldDisableToDate = date => !this.state.from || moment(date).unix() < moment(this.state.from).unix()

  renderActions = (isLast) => {
    const {stepIndex} = this.state
    return(
      <div>
        <div>
          {stepIndex!==0 &&
            <FlatButton
              label="Vissza"
              disabled={stepIndex === 0}
              onClick={this.handlePrev}
              style={{marginRight: 12}}
            />
          }
          {!isLast &&
            <FlatButton
              label="Következő"
              disabled={stepIndex === 5}
              onClick={this.handleNext}
            />
          }
        </div>
      </div>
    )
  }


  render() {
    const {open, closeNewReservation} = this.props
    const {
      onSubmitDisabled,
      name, email, tel, 
      message, from, to,
      stepIndex, 
      errorType, errorMessage, focusedField
    } = this.state

    return ReactDOM.createPortal(
      <ModalDialog 
        autoScrollBodyContent={window.innerWidth <= 768}
        contentStyle={{
          marginTop: -16,
          width: window.innerWidth <= 960 ? "95%" : 768,
          maxWidth: 'none'
        }}
        onCancel={closeNewReservation}
        submitLabel="Foglalás felvétele"
        onSubmit={this.submitNewReservation}
        {...{open, onSubmitDisabled}}
      >
        <Stepper 
          orientation="vertical"
          activeStep={stepIndex}
        >
        <Step>
            <StepLabel>Kapcsolat információ</StepLabel>
            <StepContent>
              <TextField
                id="name"
                hintText="Kovács József"
                floatingLabelText="Név"
                defaultValue={name}
                onChange={(e,value) => this.handleValueChange(value, "name")}
                onFocus={() => this.focusChange("name")}
                errorText={errorType === focusedField && errorMessage}
                // onBlur={() => this.validate("name", name)}
                />
              <TextField
                id="email"
                type="email"
                hintText="kovacs.jozsef@email.hu"
                floatingLabelText="E-mail cím"
                defaultValue={email}
                onChange={(e,value) => this.handleValueChange(value, "email")}
                onFocus={() => this.focusChange("email")}
                errorText={errorType === focusedField && errorMessage}
                // onBlur={() => this.validate("email", email)}
                />
              <TextField
                id="tel"
                type="tel"
                hintText="+36301234567"
                floatingLabelText="Telefonszám"
                defaultValue={tel}
                onChange={(e,value) => this.handleValueChange(value, "tel")}
                onFocus={() => this.focusChange("tel")}
                errorText={errorType === focusedField && errorMessage}
                // onBlur={() => this.validate("tel", tel)}
              />
              {this.renderActions()}
            </StepContent>
          </Step>
          <Step>
            <StepLabel>Dátumok</StepLabel>
            <StepContent>
              <div style={{display: "flex", justifyContent: "space-between"}}>

                <DatePicker autoOk
                  // Uncomment this for new Users, so they cannot reserve a room in the past. 
                  // shouldDisableDate={this.shouldDisableFromDate}
                  onChange={(e, date) => this.handleValueChange(date, "from")}
                  defaultDate={from || new Date()}
                  hintText="Érkezés"  
                />
                <TimePicker
                  minutesStep={30}
                  format="24hr"
                />
              </div>
              <div style={{display: "flex", justifyContent: "space-between"}}>
              <DatePicker autoOk
                // shouldDisableDate={this.shouldDisableToDate}
                onChange={(e, date) => this.handleValueChange(date, "to")}
                defaultDate={to || new Date()}
                hintText="Távozás"  
                />
                <TimePicker
                  minutesStep={30}
                  format="24hr"
                />
              </div>
              {this.renderActions()}
            </StepContent>
          </Step>
          
          <Step>
            <StepLabel>Szobák</StepLabel>
            <StepContent>
              <DropDown 
                type="roomId"
                hintText="Szoba"
                options={["1","2","3","4","5","6"]}
                handleValueChange={(value, key) => this.handleValueChange(value, key, "number")} 
              />
              {this.renderActions()}
            </StepContent>
          </Step>
          <Step>
            <StepLabel>Személyek</StepLabel>
            <StepContent>
              <DropDown 
                type="adults"
                handleValueChange={(value, key) => this.handleValueChange(value, key, "number")} 
                hintText="Felnőtt" 
                options={["1","2","3"]}
                />
              <DropDown
                type="children"
                handleValueChange={(value, key) => this.handleValueChange(value, key, "number")} 
                hintText="Gyerek" 
                options={["0","1","2"]}
              />
              {this.renderActions()}
            </StepContent>
          </Step>

          <Step>
            <StepLabel>Egyéb üzenet</StepLabel>
            <StepContent>
            <TextField
                id="message"
                multiLine
                floatingLabelText="Egyéb üzenet"
                value={message || ""}
                onChange={(e,value) => this.handleValueChange(value, "message")}
                errorText={errorMessage}
                // onBlur={() => this.validate("tel", tel)}
              />
              {this.renderActions()}
            </StepContent>
          </Step>
          <Step>
            <StepLabel>Kész</StepLabel>
            <StepContent>
              {this.renderActions(true)}
            </StepContent>
          </Step>
        </Stepper>
      </ModalDialog>, document.querySelector(".modal-root"))
  }
}

export const NewReservationFAB = ({openNewReservation}) => (
  <div className="new-reservation-btn">
  <FloatingActionButton 
    onClick={openNewReservation}
    secondary
    >
    <ContentAdd/>
  </FloatingActionButton>
  </div>
)

class DropDown extends Component {

  state = {values: []}

  handleChange = (event, index, values) => {
    this.setState({values}, () =>{
      this.props.handleValueChange(this.state.values, this.props.type)
    })
  }
  menuItems(values) {
    return this.props.options.map(option => (
        <MenuItem
          key={option}
          checked={values && values.indexOf(option) > -1}
          value={option}
          primaryText={option}
        />
      ))
  }

  render() {
    const {values} = this.state
    const {hintText} = this.props
    return (
      <SelectField
        value={values}
        onChange={this.handleChange}
        {...{hintText}}
      >
        {this.menuItems(values)}
      </SelectField>
    );
  }
}