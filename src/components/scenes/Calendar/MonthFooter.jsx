import React from 'react'

import RoomLegends from './RoomLegends'
import {Tip} from '../../shared'


const MonthFooter = ({currentDate}) => (
  <div className="calendar-footer">
    <RoomLegends/>
    <div>
      <h4>{currentDate.format("MMMM")}</h4>
      <h4>{currentDate.format("YYYY")}</h4>
    </div>
    <Tip>
      Előző hónap - ← | Következő hónap - → | Számok 1-6 - szoba elrejtése | M - Ugrás ide: ma
    </Tip>
  </div>
)

export default MonthFooter
