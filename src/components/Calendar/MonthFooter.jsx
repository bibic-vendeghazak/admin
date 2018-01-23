import React from 'react'
import RoomLegends from './RoomLegends'

const MonthFooter = ({currentDate}) => (
  <div className="calendar-footer">
    <RoomLegends/>
    <div>
      <h4>{`${currentDate.format("MMMM")}`}</h4>
      <h4>{`${currentDate.format("YYYY")}`}</h4>
    </div>
  </div>
)

export default MonthFooter
