import React, {Component} from 'react'
import moment from 'moment'
import {FloatingActionButton} from 'material-ui'

import ArrowLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left'
import ArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right'

import Days from './Days'
import MonthFooter from './MonthFooter'
import {Link} from 'react-router-dom'
import {CALENDAR} from '../../../utils/routes'

export default class Month extends Component {


  componentDidMount() {window.addEventListener("keydown", this.handleKeyUp, false)}

  componentWillUnmount() {window.removeEventListener("keydown", this.handleKeyUp, false)}


  handleKeyUp = ({keyCode}) => {
    const {
      currentDate, history
    } = this.props
    const previousMonth = moment(currentDate)
      .clone()
      .subtract(1, "month")
      .format("YYYY-M")
      .replace("-", "/")

    const nextMonth = moment(currentDate)
      .clone()
      .add(1, "month")
      .format("YYYY-M")
      .replace("-", "/")

    switch (keyCode) {
    case 37:
      history.push(`${CALENDAR}/${previousMonth}`)
      break
    case 39:
      history.push(`${CALENDAR}/${nextMonth}`)
      break
    case 48:
      let rooms = document.querySelectorAll(`.reserved`)
      const roomLegends = document.querySelectorAll(`.room-legend p`)
      roomLegends.forEach(roomLegend => {roomLegend.classList.toggle("unchecked")})
      rooms.forEach(room => {room.classList.toggle('hidden')})
      break
    case 49:
    case 50:
    case 51:
    case 52:
    case 53:
    case 54:
      const roomIndex = keyCode-48
      rooms = document.querySelectorAll(`.reserved.room-${roomIndex}`)
      document.querySelector(`.room-legend .room-${roomIndex}`).classList.toggle("unchecked")
      rooms.forEach(room => {room.classList.toggle('hidden')})
      break
    case 77:
      const today = moment()
      history.push(`${CALENDAR}/${today.format("YYYY")}/${today.format("M")}`)
      break
    default:
      return
    }
  }

  render() {
    const {
      history, reservations, currentDate
    } = this.props
    const currentMonthDays = currentDate.daysInMonth()
    const previousMonth = moment(currentDate).clone().subtract(1, "month")
    const nextMonth = moment(currentDate).clone().add(1, "month")

    const previousMonthDays = previousMonth.daysInMonth()
    let extraDaysBefore = currentDate.clone().date(0).day()
    extraDaysBefore = extraDaysBefore === 0 ? 7 : extraDaysBefore

    return (
      <div id="month-wrapper">

        <DayNames/>

        <ul className="days">

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

          {/* <PlaceholderDays to={42 - currentMonthDays - extraDaysBefore}/> */}

        </ul>

        <MonthControls {...{
          history,
          previousMonth,
          nextMonth
        }}
        />
        <MonthFooter {...{currentDate}}/>

      </div>
    )
  }
}

const DayNames = () => (
  <ul className="days-title">
    {Array(7).fill().map((x,key) => (
      <li
        {...{key}}
        className={`day-title ${(key > 4) && "weekend-title"}`}
      >
        <span>{moment().day(key+1).format('dddd')}</span>
      </li>
    ))
    }
  </ul>
)

const MonthControls = ({
  history, previousMonth, nextMonth
}) => {

  previousMonth = previousMonth.format("YYYY/MM")
  nextMonth = nextMonth.format("YYYY/MM")
  return(
    <div>
      <Link to={`${CALENDAR}/${previousMonth}`}>
        <FloatingActionButton
          className="prev-month-btn month-btn"
          mini
          secondary
          title={`←\n__________\nNyomd le ezt a billentyűt`}
        >
          <ArrowLeft/>
        </FloatingActionButton>
      </Link>
      <Link to={`${CALENDAR}/${nextMonth}`}>
        <FloatingActionButton
          className="next-month-btn month-btn"
          mini
          secondary
          title={`→\n__________\nNyomd le ezt a billentyűt`}
        >
          <ArrowRight/>
        </FloatingActionButton>
      </Link>
    </div>
  )
}