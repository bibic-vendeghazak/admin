import React, {Component} from 'react'
import moment from 'moment'

import {withStyles} from '@material-ui/core'

import {routes, colors, toRoute} from '../../../utils'

import Days from './Days'
// import MonthFooter from './MonthFooter'

class Month extends Component {

  componentDidMount() {window.addEventListener("keydown", this.handleKeyUp, false)}

  componentWillUnmount() {window.removeEventListener("keydown", this.handleKeyUp, false)}


  handleKeyUp = ({keyCode}) => {
    const {
      currentDate, history
    } = this.props
    const previousMonth = moment(currentDate)
      .clone()
      .subtract(1, "month")
      .format("YYYY/MM")

    const nextMonth = moment(currentDate)
      .clone()
      .add(1, "month")
      .format("YYYY/MM")

    const today = moment()

    switch (keyCode) {
    case 37:
      history.push(toRoute(routes.CALENDAR, previousMonth))
      break
    case 39:
      history.push(toRoute(routes.CALENDAR, nextMonth))
      break
    case 77:
      history.push(toRoute(routes.CALENDAR, today.format("YYYY"), today.format("M")))
      break
    default:
      return
    }
  }

  render() {
    const {
      reservations, currentDate, classes
    } = this.props
    const currentMonthDays = currentDate.daysInMonth()
    const previousMonth = moment(currentDate).clone().subtract(1, "month")
    const nextMonth = moment(currentDate).clone().add(1, "month")

    const previousMonthDays = previousMonth.daysInMonth()
    let extraDaysBefore = currentDate.clone().date(0).day()
    extraDaysBefore = extraDaysBefore === 0 ? 7 : extraDaysBefore

    return (
      <div className={classes.monthWrapper}>

        <ul className={classes.monthBody}>

          {/* Previous month*/}
          <Days
            from={previousMonthDays - extraDaysBefore}
            isPlaceholder
            to={previousMonthDays}
            {...{
              currentDate: previousMonth,
              reservations
            }}
          />

          {/* Current month */}
          <Days {...{
            currentDate,
            to: currentMonthDays ,
            reservations
          }}
          />

          {/* Next month */}
          <Days
            isPlaceholder
            to={42 - currentMonthDays - extraDaysBefore}
            {...{
              currentDate: nextMonth,
              reservations
            }}
          />

        </ul>

      </div>
    )
  }
}

const styles = theme => ({
  monthWrapper: {
    height: "calc(100vh - 64px)",
    display: "flex",
    flexDirection: "column"
  },
  monthBody: {
    flex: 1,
    fontFamily: "sans-serif",
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gridTemplateRows: "repeat(6, 1fr)",
    margin: 0,
    padding: 0,
    listStyleType: "none",
    fontWeight: "bold",
    "& .day-tile": {
      // backgroundColor: "#d4d4d4",
      display: "flex",
      position: "relative",
      borderBottom: '1px solid #333',
      borderRight: '1px solid #333',
      boxSizing: "border-box",
      cursor: "pointer",
      transition: ".2s ease-in-out"
    },
    "& .day-tile:hover": {backgroundColor: "#ededed"},
    "& .placeholder": {opacity: .5},
    "& li p": {
      position: "absolute",
      padding: 8,
      margin: 0
    },
    "& li > a": {flex: 1},
    "& li a": {
      position: "relative",
      textDecoration: "none",
      color: "black"
    },
    "& .reserved-list": {
      padding: 0,
      top: 22,
      width: "100%",
      position: "relative",
      listStyleType: "none"
    },
    "& .reserved-list li": {
      position: "absolute",
      width: "100%",
      height: 5
    },
    "& .from": {
      width: "25% !important",
      left: "75%",
      borderTopLeftRadius: 4,
      borderBottomLeftRadius: 4
    },
    "& .to": {
      width: "25% !important",
      borderTopRightRadius: 4,
      borderBottomRightRadius: 4
    },
    "& .room-1": {
      backgroundColor: colors.room1,
      marginTop: 0
    },
    "& .room-2": {
      backgroundColor: colors.room2,
      marginTop: 7
    },
    "& .room-3": {
      backgroundColor: colors.room3,
      marginTop: 14
    },
    "& .room-4": {
      backgroundColor: colors.room4,
      marginTop: 21
    },
    "& .room-5": {
      backgroundColor: colors.room5,
      marginTop: 28
    },
    "& .room-6": {
      backgroundColor: colors.room6,
      marginTop: 35
    },
    "& .today": {
      fontSize: ".7em",
      display: "grid",
      justifyItems: "center",
      alignItems: "center",
      color: "#fff !important",
      margin: 4,
      padding: 5,
      position: "absolute",
      backgroundColor: theme.palette.secondary.main,
      borderRadius: "50%"
    }
  }
})

export default withStyles(styles)(Month)
