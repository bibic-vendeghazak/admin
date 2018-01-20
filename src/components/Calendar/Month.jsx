import React, { Component } from 'react'
import Day from './Day'
import Header from './Header'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ArrowLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left'
import ArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right'

const fullDate = new Date()
const year = fullDate.getFullYear()
const month = fullDate.getMonth()

const initialState = {
  date: {
    fullDate, year, month,
    daysInMonth: new Date(year,month,-1).getDate()
  },
  today: new Date()
}
const Days = ({days}) => {
  return <ul className="days">{days}</ul>
}

const Weekdays = ({days}) => {
  return(
    <ul className="days-title">
      {Array(days.length).fill().map((x,i) => <li key={i} className={`day-title ${(i === 5 || i === 6) && "weekend-title"}`}><span>{days[i]}</span></li>)}
    </ul>
  )
}

export default class Month extends Component {
  constructor(){
    super()
    this.state = initialState
  }

  changeDate(direction){
    const {date} = this.state
    let {fullDate, year} = date
    let month = (date.month + direction) % 12
    fullDate.setFullYear(year + direction)
    if (!direction) {
      fullDate = new Date()
      year = fullDate.getFullYear()
      month = fullDate.getMonth()
      this.setState({
        date: {
          fullDate, year, month,
          daysInMonth: new Date(year,month,0).getDate()
        }
      })
      return
    } else {
      if (date.month + direction === 12) {
        month = 0
        year += direction
      } else if (date.month + direction < 0) {
        month += 12
        year += direction
      }

      fullDate.setMonth(month)
      this.setState({
        date:{
          fullDate, year, month,
          daysInMonth: new Date(year, month+1, 0).getDate()
        }
      })

    }
  }

  handleKeyUp(e){
    switch (e.keyCode) {
      case 37:
        this.changeDate(-1)
        break
      case 39:
        this.changeDate(1)
        break
      case 77:
        this.changeDate(0)
        break
      default:
        return
    }
  }

  componentDidMount() {
    document.addEventListener("keydown", e => this.handleKeyUp(e), true)
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", e => this.handleKeyUp(e), true)
  }

  componentWillReceiveProps({appBarRightAction}) {
    appBarRightAction === "calendar" && this.changeDate(0)
  }

  render() {
    let days = []
    const {handleDayClick} = this.props
    const {date, today} = this.state
    const {fullDate, year, month, daysInMonth} = date
    // Pushing the first day in the month to appropriate place.
    for (let i = new Date(year, month, 1).getUTCDay(); i > 0 ; i--) {
      days.push(
        <Day
          key={i+100}
          day={new Date(year, month, -i+1).getDate()}
          isPlaceholder
          handleDayClick={handleDayClick}
        />
      )
    }
    const placeholderLengthBefore = days.length

    // Generating the month.
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday = i === today.getDate() && today.toDateString() === fullDate.toDateString()
      let reservations = {}

      Object.keys(this.props.reservations).forEach(key => {
        const value = this.props.reservations[key]
        const {from, to, roomId} = value
        const date = (...date) => new Date(...date).toISOString().slice(0,10)
        const day = date(year, month, i)

        // HACK: Shift reservation one day to left
        const dayFrom = date(from-86400)
        const dayTo = date(to-86400)

        if (day >= dayFrom && day <= dayTo) {
          let reservation = reservations[key] = {roomId}
          if (day === dayFrom && day === dayTo) {
            Object.assign(
              reservation,
              {
                from: true,
                to: true
              }
            )
          } else if (day === dayFrom)  {
            Object.assign(reservation,{from: true})
          } else if (day === dayTo) {
            Object.assign(reservation,{to: true})
          }
        }
      })

      days.push(<Day {...{key: i, day: i, isToday, month, handleDayClick, reservations}}/>)
    }

    // Pushing the next months' first days to the end of the months so it is always 42 days on the page.
    for (var i = days.length; i < 42; i++) {
      days.push(
        <Day key={i+200} day={i-daysInMonth-placeholderLengthBefore+1}
          {...{handleDayClick}}
          isPlaceholder
        />
      )
    }

    return (
      <div id="month-wrapper">
        <Weekdays days={["H","K","Sze","Cs","P","Szo","V"]}/>
        <Days days={days}/>
        <FloatingActionButton secondary className="prev-month-btn month-btn" onClick={() => this.changeDate(-1)}>
          <ArrowLeft/>
        </FloatingActionButton>
        <FloatingActionButton secondary className="next-month-btn month-btn" onClick={() => this.changeDate(1)}>
          <ArrowRight/>
        </FloatingActionButton>
        <Header {...{year,month}}/>
      </div>
    )
  }
}

