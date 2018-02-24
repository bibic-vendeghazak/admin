import React, { Component } from 'react'
import moment from 'moment'
import firebase from 'firebase'
import Month from './Month'
import DayBig from './DayBig'

const reservationsRef = firebase.database().ref("/reservations")

export default class Calendar extends Component {

  state = {
    reservations: null,
    isDayBig: false,
    date: null,
    bigDayreservations: null,
    currentDate: moment()
  }


  componentDidMount() {
    reservationsRef.on("value", snap => {
      const reservations = snap.val()
      reservations && Object.keys(reservations).forEach(reservation => {
        if(!reservations[reservation].metadata.handled){
          delete reservations[reservation]
        } 
      })
      this.setState({reservations})
    })
  }

  changeDate = direction => {
    this.setState( ({currentDate}) => ({
      currentDate: !direction ? moment() : currentDate.add(direction, 'month')
    }))
  }

  handleDayClick = day => {
    const {date, dayReservations} = day
    const reservations = Object.assign({}, this.state.reservations)
    Object.keys(reservations).forEach( key => {
      !dayReservations.includes(key) && delete reservations[key]
    })
    
    this.setState({
      isDayBig: true,
      date,
      bigDayreservations: reservations
    })
  }

  closeBigDay = () => {
    this.setState({isDayBig: false})
  }

  // FIXME: Clicking on hamburger menu triggers closeBigDay()
  componentWillReceiveProps ({appBarRightAction}) {
    if (appBarRightAction === "calendar") {
      this.state.isDayBig ? this.closeBigDay() : this.changeDate(0)
    }
  }

  render() {    
    const reservations = {}
    const {isDayBig, date, currentDate} = this.state
    Object.entries(this.state.reservations || {}).forEach(reservation => {
      const [key,value] = reservation
      const {roomId, from, to} = value.metadata
      reservations[key] = {roomId, from, to}
    })


    return (
      <div id="calendar-wrapper">
        {isDayBig ?
          <DayBig
            closeBigDay={this.closeBigDay}
            reservations={this.state.bigDayreservations}
            {...{date}}
          /> :
          <Month 
            handleDayClick={this.handleDayClick}
            changeDate={this.changeDate}
            {...{reservations, currentDate}}
          />
        }
      </div>
    )
  }
}