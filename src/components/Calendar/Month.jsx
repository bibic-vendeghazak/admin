import React, { Component } from 'react'
import Days from './Days'
import MonthFooter from './MonthFooter'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ArrowLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left'
import ArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right'
import moment from 'moment'

export default class Month extends Component {
  constructor(props){
    super(props);
    this.handleKeyUp = this.handleKeyUp.bind(this)
  }
  handleKeyUp({keyCode}) {
    switch (keyCode) {
      case 37:
        this.props.changeDate(-1)
        break
      case 39:
        this.props.changeDate(1)
        break
      case 77:
        this.props.changeDate(0)
        break
      default:
        return
    }
  }

  componentDidMount() {window.addEventListener("keydown", this.handleKeyUp, false)}

  componentWillUnmount() {window.removeEventListener("keydown", this.handleKeyUp, false)}

  
  render() {
    const {handleDayClick, reservations, currentDate, changeDate} = this.props
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
            to={previousMonthDays}
            isPlaceholder
            {...{currentDate: previousMonth, reservations, handleDayClick}}
          />

          {/* Current month */}
          <Days {...{currentDate, to: currentMonthDays , reservations, handleDayClick}}/>

          {/* Next month */}
          <Days 
          to={42 - currentMonthDays - extraDaysBefore}
          isPlaceholder
          {...{currentDate: nextMonth, reservations, handleDayClick}}/>

          {/* <PlaceholderDays to={42 - currentMonthDays - extraDaysBefore}/> */}

        </ul>

        <MonthControls {...{changeDate}}/>
        <MonthFooter {...{currentDate}}/>

      </div>
    )
  }
}

const DayNames = () => (
  <ul className="days-title">
    {Array(7).fill().map((x,key) => (
        <li {...{key}} className={`day-title ${(key > 4) && "weekend-title"}`}>
          <span>{moment().day(key+1).format('dddd')}</span>
        </li>
      ))
    }
  </ul>
)

const MonthControls = ({changeDate}) => (
  <div>
    <FloatingActionButton mini secondary className="prev-month-btn month-btn" onClick={() => changeDate(-1)}>
      <ArrowLeft/>
    </FloatingActionButton>
    <FloatingActionButton mini secondary className="next-month-btn month-btn" onClick={() => changeDate(1)}>
      <ArrowRight/>
    </FloatingActionButton>
  </div>
)