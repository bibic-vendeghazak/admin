import React, { Component } from 'react'
import Month from './Month'
import DayBig from './DayBig'
import RoomLegend from './RoomLegend'

const RoomLegends = ({i}) => {
  return(
    <div className="room-legend">
      <ul>
        {Array(i).fill().map((x,i) => <RoomLegend key={i} id={i+1}/>)}
      </ul>
      <h5>Színjelölés(szobaszám)</h5>
    </div>
  )
}

const initialState = {
  isDayBig: false,
  date: {},
  reservations: {}
}

export default class Calendar extends Component {
  constructor(){
    super()
    this.state = initialState
  }

  handleDayClick(dayData){
    const {date, dayReservations} = dayData
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

  closeBigDay(){
    this.setState(initialState)
  }

  render() {
    const reservations = {}
    const {isDayBig, date} = this.state

    Object.entries(this.props.reservations).forEach(reservation => {
      const [key,value] = reservation
      const {roomId, from, to} = value.metadata
      reservations[key] = {roomId, from, to}
    })

    return (
      <div id="calendar-wrapper">
        <Month handleDayClick={day => this.handleDayClick(day)} reservations={reservations}/>

        {isDayBig &&
          <DayBig
            closeBigDay={() => this.closeBigDay()}
            date={date}
            reservations={this.state.reservations}
          />
        }

        <RoomLegends i={6}/>
      </div>
    )
  }
}
