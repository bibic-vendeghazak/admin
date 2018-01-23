import React, { Component } from 'react'
import Month from './Month'
import DayBig from './DayBig'
import moment from 'moment'


export default class Calendar extends Component {

  state = {
    isDayBig: false,
    date: {},
    reservations: {},
    currentDate: moment()
  }

  changeDate = direction => {
    this.setState( ({currentDate}) => ({
      currentDate: !direction ? moment() : currentDate.add(direction, 'month')
    }))
  }

  handleDayClick = day => {
    const {date, dayReservations} = day
    const reservations = Object.assign({}, this.props.reservations)
    Object.keys(reservations).forEach( key => {
      !dayReservations.includes(key) && delete reservations[key]
    })
    this.setState({
      isDayBig: true,
      date,
      reservations
    })
  }

  closeBigDay = () => this.setState(({isDayBig}) => ({isDayBig: !isDayBig}))

  // FIXME: Clicking on hamburger menu triggers closeBigDay()
  componentWillReceiveProps ({appBarRightAction}) {
    if (appBarRightAction === "calendar") {
      this.state.isDayBig ? this.closeBigDay() : this.changeDate(0)
    }
  }

  render() {    
    const reservations = {}
    const {isDayBig, date, currentDate} = this.state
    Object.entries(this.props.reservations).forEach(reservation => {
      const [key,value] = reservation
      const {roomId, from, to} = value.metadata
      reservations[key] = {roomId, from, to}
    })


    return (
      <div id="calendar-wrapper">
        {isDayBig ?
          <DayBig
            closeBigDay={this.closeBigDay}
            reservations={this.state.reservations}
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