import React, {Component} from 'react'
import ReactDOM from 'react-dom'

import firebase from 'firebase'
import moment from 'moment'

import FloatingActionButton from 'material-ui/FloatingActionButton'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import DatePicker from 'material-ui/DatePicker'

import {
  Step,
  Stepper,
  StepButton,
} from 'material-ui/Stepper'
import StepContent from 'material-ui/Stepper/StepContent'

export default class NewReservation extends Component {

  state = {
    newReservation: {
      name: "",
      email: "",
      tel: "",
      message: "",
      roomId: 3,
      adults: 1,
      children: 0,
      from: null,
      to: null,
    }
  }
  handleSubmitDialog = () => {
    // this.props.handleSubmitDialog()
    const {newReservation:{
      name, email, tel, message, roomId, adults, children, from, to
    }} = this.state
    const reservationsRef = firebase.database().ref("reservations")
    reservationsRef.child('metadata').push().then(snap => {
      const {key} = snap
      const metadata = {roomId, from: from.unix()*1000, to: to.unix()*1000, handled: false}
      const details = {name, email, tel, message, adults, children}
      console.log({metadata, details});

      reservationsRef.child(key).set({metadata, details}).then(() => this.props.handleSubmitDialog())
    })
  }

  parseValue = (value, type) => {
    switch (type) {
      case "number":
        return parseInt(value, 10)
      case "date":
        return moment(value)
      default:
        return value
    }
  }
  handleValueChange = (value, key, type) => {
    this.setState({
      newReservation: {
        ...this.state.newReservation,
        [key]: this.parseValue(value, type)
      }
    })
  }

  render() {
  const { isDialogOpen, handleCancelDialog} = this.props
  const {newReservation} = this.state
    return ReactDOM.createPortal(
      <Dialog 
        onRequestClose={handleCancelDialog}
        actions={[
          <FlatButton
          label="Mégse"
          onClick={handleCancelDialog}
          style={{marginRight: 12}}

          />,
          <RaisedButton
            label="Foglalás felvétele"
            secondary
            // disabled={!newReservation.to}
            onClick={this.handleSubmitDialog}
          />
          ]}
          open={isDialogOpen}
        >
        
        <HorizontalLinearStepper {...{...newReservation, handleValueChange: this.handleValueChange}}/>
      </Dialog>
    , document.querySelector(".modal-root"))
  }
}

export const NewReservationButton = ({openDialog}) => (
  <div className="new-reservation-btn">
  <FloatingActionButton 
    onClick={openDialog}
    secondary
    >
    <ContentAdd/>
  </FloatingActionButton>
  </div>
)



class HorizontalLinearStepper extends Component {

  state = {
    stepIndex: 0,
    errorTexts: {
      errorName: "",
      errorTel: "",
      errorEmail: "",
      errorMessage: ""
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
  // validate = (type, value) => {
  //   const {errorTexts} = this.state
  //   let method = undefined
  //   let errorType = undefined
  //   let errorText = undefined
  //   switch(type) {
  //     case "email":
  //       errorType = "errorEmail"
  //       errorText = "Érvénytelen e-mail cím"
  //       method = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  //     case "tel":
  //       errorType = "errorTel"
  //       errorText = "Érvénytelen telefonszám(pl. +36301234567)"
  //       method = /^\+?\d+$/
  //     default:
  //       return
  //   }
  //   this.setState({
  //     errorTexts: {
  //       ...errorTexts,
  //       [errorType]: (value === "" || method.test(value)) ? "" : errorText
  //     }
  //   })
  // }

  renderActions = (isLast=false) => {
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
            <RaisedButton
              label="Következő"
              disabled={stepIndex === 5}
              secondary
              onClick={this.handleNext}
            />
          }
        </div>
      </div>
    )
  }

  render() {
    const {
      stepIndex,
      errorTexts: {errorName, errorEmail, errorTel, errorMessage}
    } = this.state
    const {name, email, tel, message, from, to, handleValueChange} = this.props
    
    return(
      <div>
        <Stepper 
          orientation="vertical"
          activeStep={stepIndex}
        >
          <Step>
            <StepButton onClick={() => this.setState({stepIndex: 0})}>
              Kapcsolat információ
            </StepButton>
            <StepContent>
              <TextField 
                hintText="Kovács József"
                floatingLabelText="Név"
                defaultValue={name}
                onChange={(e,value) => handleValueChange(value, "name")}
                errorText={errorName}
                // onBlur={() => this.validate("name", name)}
                />
              <TextField
                type="email"
                hintText="kovacs.jozsef@email.hu"
                floatingLabelText="E-mail cím"
                defaultValue={email}
                onChange={(e,value) => handleValueChange(value, "email")}
                errorText={errorEmail}
                // onBlur={() => this.validate("email", email)}
                />
              <TextField
                type="tel"
                hintText="+36301234567"
                floatingLabelText="Telefonszám"
                defaultValue={tel}
                onChange={(e,value) => handleValueChange(value, "tel")}
                errorText={errorTel}
                // onBlur={() => this.validate("tel", tel)}
              />
              {this.renderActions()}
            </StepContent>
          </Step>
          <Step>
            <StepButton onClick={() => this.setState({stepIndex: 1})}>
              Szobák
            </StepButton>
            <StepContent>
              <DropDown 
                type="roomId"
                hintText="Szoba"
                options={["1","2","3","4","5","6"]}
                handleValueChange={(value, key) => handleValueChange(value, key, "number")} 
              />
              {this.renderActions()}
            </StepContent>
          </Step>
          <Step>
            <StepButton onClick={() => this.setState({stepIndex: 2})}>
              Személyek
            </StepButton>
            <StepContent>
              <DropDown 
                type="adults"
                handleValueChange={(value, key) => handleValueChange(value, key, "number")} 
                hintText="Felnőtt" 
                options={["1","2","3"]}
                />
              <DropDown
                type="children"
                handleValueChange={(value, key) => handleValueChange(value, key, "number")} 
                hintText="Gyerek" 
                options={["0","1","2"]}
              />
              {this.renderActions()}
            </StepContent>
          </Step>
          <Step>
            <StepButton onClick={() => this.setState({stepIndex: 3})}>
              Dátumok
            </StepButton>
            <StepContent>
              <DatePicker hintText="Érkezés" autoOk onChange={(e, date) => handleValueChange(date, "from", "date")} defaultDate={from ? from : new Date()}/>
              <DatePicker hintText="Távozás" autoOk onChange={(e, date) => handleValueChange(date, "to", "date")} defaultDate={to ? to : new Date()}/>
              {this.renderActions()}
            </StepContent>
          </Step>
          <Step>
            <StepButton onClick={() => this.setState({stepIndex: 4})}>
              Egyéb üzenet
            </StepButton>
            <StepContent>
            <TextField
                multiLine
                floatingLabelText="Egyéb üzenet"
                value={message}
                onChange={(e,value) => handleValueChange(value, "message")}
                errorText={errorMessage}
                // onBlur={() => this.validate("tel", tel)}
              />
              {this.renderActions()}
            </StepContent>
          </Step>
          <Step>
            <StepButton onClick={() => this.setState({stepIndex: 5})}>
              Kész
            </StepButton>
            <StepContent>
              {this.renderActions(true)}
            </StepContent>
          </Step>
        </Stepper>
      </div>
    )
  }
}


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