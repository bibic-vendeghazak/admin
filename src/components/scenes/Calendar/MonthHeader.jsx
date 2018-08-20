import React from 'react'
import PropTypes from 'prop-types'
import {weekdays} from 'moment'

const MonthHeader = ({classes}) => (
  <ul className={classes}>
    {weekdays(true).map((day, i) => (
      <li
        className={i > 4 ? "weekend-tile" : ""}
        key={day}
      >
        <span>{day}</span>
      </li>
    ))
    }
  </ul>
)

MonthHeader.propTypes = {classes: PropTypes.string}

export default MonthHeader