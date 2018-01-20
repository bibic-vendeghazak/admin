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
    </div>
  )
}

export default Header
