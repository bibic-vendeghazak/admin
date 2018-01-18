import React from 'react'

const Header = ({year, month, changeDate}) => {
  const months = [
    "Január", "Február", "Március",
    "Április", "Május", "Június",
    "Július", "Augusztus", "Szeptember",
    "Október", "November", "December"]
  return (
    <div className="calendar-header">
      <h4>{year}</h4>
      <h3>{months[month]}</h3>
      <span
        className="step-month-btn prev-month"
        onClick={() => changeDate(-1)}/>
      <span
        className="step-month-btn today-month"
        onClick={() => changeDate(0)}
      >
        Ma
      </span>
      <span
        className="step-month-btn next-month"
        onClick={() => changeDate(1)}/>
    </div>
  )
}

export default Header
