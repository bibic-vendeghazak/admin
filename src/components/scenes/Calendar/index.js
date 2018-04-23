import React, { Component } from 'react'
import {Route} from 'react-router-dom'
import moment from 'moment'
import Month from './Month'
import DayBig from './DayBig'
import { CALENDAR } from '../../../utils/routes'
import {RESERVATIONS_FS} from '../../../utils/firebase'

export default class Calendar extends Component {

  state = {
    reservations: {},
    date: null,
    currentDate: moment(),
    mutat: []
  }

  updateURL = ({year, month}) => {
    this.setState({currentDate: moment().year(year).month(month-1)})
  }

  componentDidMount() {
    this.updateURL(this.props.match.params)
    RESERVATIONS_FS.where("handled", "==", true).onSnapshot(snap => {
      this.setState({reservations: {}})
      snap.forEach(reservation => {
        const {from, to, roomId} = reservation.data()
        this.setState(({reservations}) => ({
          reservations: {
            ...reservations,
            [reservation.id]: {from, to, roomId}
          }
        })) 
      })
    })
  }


  componentWillReceiveProps = ({match:{params}}) => {
    this.updateURL(params)
  }




  render() {
    const {history} = this.props
    const {currentDate, reservations} = this.state
    
    
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