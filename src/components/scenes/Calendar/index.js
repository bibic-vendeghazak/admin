import React, {Component} from "react"
import {Route} from "react-router-dom"
import moment from "moment"
import Month from "./Month"
import DayBig from "./DayBig"
import {routes, toRoute} from "../../../utils"
import {RESERVATIONS_FS} from "../../../utils/firebase"

export default class Calendar extends Component {

  state = {
    reservations: {},
    date: null,
    currentDate: moment(),
    mutat: []
  }


  componentDidMount() {
    this.updateURL(this.props.match.params)
    RESERVATIONS_FS.where("handled", "==", true).onSnapshot(snap => {
      this.setState({reservations: {}})
      snap.forEach(reservation => {
        const {
          from, to, roomId
        } = reservation.data()
        this.setState(({reservations}) => ({reservations: {
          ...reservations,
          [reservation.id]: {
            from,
            to,
            roomId
          }
        }}))
      })
    })
  }


  UNSAFE_componentWillReceiveProps = ({match:{params}}) => {
    this.updateURL(params)
  }

  updateURL = ({
    year, month
  }) => {
    this.setState({currentDate: moment().year(year).month(month-1)})
  }


  render() {
    const {history} = this.props
    const {
      currentDate, reservations
    } = this.state


    return (
      <div id="calendar-wrapper">
        <Route
          component={
            () => (
              <Month
                {...{
                  history,
                  reservations,
                  currentDate
                }}
              />
            )
          }
          exact
          path={toRoute(routes.CALENDAR, ":year", ":month")}
        />
        <Route
          path={toRoute(routes.CALENDAR, ":year", ":month", ":day")}
          render={({
            match, history
          }) =>
            <DayBig
              {...{
                match,
                history
              }}
            />
          }
        />
      </div>
    )
  }
}