import React, { Component } from 'react'
import {Route} from 'react-router-dom'
import moment from 'moment'
import firebase from 'firebase'
import Month from './Month'
import DayBig from './DayBig'
import { CALENDAR } from '../../../utils/routes';
const reservationsRef = firebase.database().ref("/reservations")

export default class Calendar extends Component {

  state = {
    reservations: null,
    date: null,
    currentDate: moment(),
    mutat: []
  }

  updateURL = params => {
    if (params.year && params.month) {
      const {year, month} = params
      this.setState({
        currentDate:  moment(`${year}-${month}-01`)
      })
    }
  }

  componentDidMount() {
    
    this.updateURL(this.props.match.params)

    reservationsRef.on("value", snap => {
      const reservations = snap.val()
      reservations && Object.keys(reservations).forEach(reservation => {
        if(!reservations[reservation].handled){
          delete reservations[reservation]
        } 
      })
      this.setState({reservations})
    })
  }


  componentWillReceiveProps = ({match:{params}}) => {
    this.updateURL(params)
  }

  changeDate = direction => {
    this.setState( ({currentDate}) => ({
      currentDate: !direction ? moment() : currentDate.add(direction, 'month')
    }))
  }


  render() {
    const {history} = this.props
    const reservations = {}
    const {currentDate} = this.state
    Object.entries(this.state.reservations || {}).forEach(reservation => {
      const [key,value] = reservation
      const {roomId, from, to} = value
      reservations[key] = {roomId, from, to}
    })

    
    return (
      <div id="calendar-wrapper">
        <Route exact path={`${CALENDAR}/:year/:month`} component={
          () => (
            <Month 
            handleDayClick={this.handleDayClick}
            {...{history, reservations, currentDate}}
            />
          )
        }/>
        <Route path={`${CALENDAR}/:year/:month/:day`} component={DayBig}/>
      </div>
    )
  }
}