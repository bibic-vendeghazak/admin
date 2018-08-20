import React, {Fragment} from 'react'
import PropTypes from 'prop-types'

import {Link} from 'react-router-dom'

import ArrowLeft from '@material-ui/icons/ArrowLeftRounded'
import ArrowRight from '@material-ui/icons/ArrowRightRounded'

import {routes, toRoute} from '../../../utils'

import {Button, Tooltip} from '@material-ui/core'


const MonthControls = ({
  previousMonth, nextMonth
}) =>
  <Fragment>
    <Tooltip title="Előző hónap">
      <Button
        color="secondary"
        component={Link}
        mini
        style={{
          position: "absolute",
          margin: "0 16px",
          top: "50%"
        }}
        to={toRoute(routes.CALENDAR, previousMonth.format("YYYY/MM"))}
        variant="fab"
      >
        <ArrowLeft/>
      </Button>
    </Tooltip>
    <Tooltip title="Következő hónap">
      <Button
        color="secondary"
        component={Link}
        mini
        style={{
          position: "absolute",
          margin: "0 16px",
          top: "50%",
          right: 0
        }}
        to={toRoute(routes.CALENDAR, nextMonth.format("YYYY/MM"))}
        variant="fab"
      >
        <ArrowRight/>
      </Button>
    </Tooltip>
  </Fragment>

MonthControls.propTypes = {
  previousMonth: PropTypes.object,
  nextMonth: PropTypes.object
}

export default MonthControls