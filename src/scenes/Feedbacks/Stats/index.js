

import React, {Component} from 'react'
import {Link} from "react-router-dom"
import {
  AreaChart, XAxis, YAxis, CartesianGrid, Area, Tooltip, ResponsiveContainer,
  Radar, RadarChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis
} from "recharts"
import moment from "moment"
import {colors, routes, toRoute} from "../../../utils"
import {Select, MenuItem, Grid, Typography, InputLabel, Paper} from '@material-ui/core'
import {withStore} from '../../../db'
import {Loading} from '../../../components/shared'

import {mutateAvg, roomFilter, mutateCategory} from "./mutations"


const today = moment()

class Stats extends Component {

  static defaultProps = {
    chartHeight: 200,
    startOffset: 12
  }

  state = {
    interval: "week",
    startOffset: this.props.startOffset,
    roomId: 1,
    overallChart: [],
    roomData: [],
    roomServiceData: [],
    period: {
      start: today.clone().add(-this.props.startOffset, "week"),
      end: today
    }
  }


  componentDidUpdate = (
    {feedbacks: prevFeedbacks}, {
      interval: prevInterval, roomId: prevRoomId
    }
  ) => {
    if (!this.props.isLoading) {
      const {feedbacks} = this.props
      const {
        interval, roomId, period
      } = this.state
      if (
        feedbacks.length !== prevFeedbacks.length ||
        prevInterval !== interval
      ) {
        this.setState({
          overallChart: mutateAvg(feedbacks, period, interval),
          roomServiceData: mutateCategory(feedbacks, period.start, interval),
          roomData: mutateAvg(feedbacks.filter(roomFilter(roomId)), period, interval)
        })
      }
      if (prevRoomId !== roomId) {
        this.setState({roomData: mutateAvg(feedbacks.filter(roomFilter(roomId)), period, interval)})
      }
    }
  }

  handleRoomChange = ({target: {value}}) => this.setState({roomId: value})

  handleIntervalChange = ({target: {value}}) => {
    const {period} = this.state
    let {startOffset} = this.state
    switch (value) {
    case "month":
      startOffset = 6
      break
    case "day":
      startOffset = 90
      break
    case "year":
      startOffset = 3
      break
    default:
      startOffset = this.props.startOffset
      break
    }
    period.start = today.clone().add(-startOffset, value)
    this.setState({
      startOffset,
      interval: value,
      period
    })
  }


  render() {
    const {
      interval, roomId,
      overallChart, roomData, roomServiceData,
      period
    } = this.state
    const {
      rooms, isLoading, chartHeight
    } = this.props


    return (
      <Grid container spacing={16}>


        <Grid item xs={12}>

          <Paper style={{padding: 16}}>
            <Typography >Összesített értékelés (utolsó {period.start.fromNow(true)})</Typography>
            {isLoading ? <Loading/> :
              <ResponsiveContainer height={chartHeight} width="100%">
                <AreaChart
                  data={overallChart}
                  margin={{
                    top: 16,
                    left: 32,
                    right: 32
                  }}
                  style={{fontFamily: "sans-serif"}}
                >
                  <defs>
                    <linearGradient id="color-primary" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="100%" stopColor={colors.lightBrown} stopOpacity={0.9}/>
                      <stop offset="10%" stopColor={colors.lightBrown} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" tickMargin={8}/>
                  <YAxis domain={[0, 5]} hide/>
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip wrapperStyle={{fontSize: 12}}/>
                  <Area
                    connectNulls
                    dataKey="átlag"
                    fill="url(#color-primary"
                    fillOpacity={1}
                    stroke={colors.lightBrown}
                    type="monotone"
                  />
                </AreaChart>
              </ResponsiveContainer>
            }
          </Paper>
        </Grid>
        <Grid container item justify="space-between">
          <Grid item>
            <InputLabel htmlFor="intervals">Felbontás</InputLabel>
            <Select
              inputProps={{id: "intervals"}}
              name="interval"
              onChange={this.handleIntervalChange}
              style={{margin: 8}}
              value={interval}
            >
              {/* <MenuItem value="year">év</MenuItem> */}
              <MenuItem value="month">hónap</MenuItem>
              <MenuItem value="week">hét</MenuItem>
              <MenuItem value="day">nap</MenuItem>
            </Select>
          </Grid>
          <Grid item>
            <InputLabel htmlFor="rooms">Szoba</InputLabel>
            <Select
              inputProps={{id: "rooms"}}
              onChange={this.handleRoomChange}
              style={{margin: 8}}
              value={roomId}
            >
              {rooms.map(({id}) =>
                <MenuItem key={id} value={id}>{id}</MenuItem>)
              }
            </Select>
          </Grid>
        </Grid>
        <Grid item md={4} sm={6} xs={12}>
          <Paper style={{padding: 16}}>
            <Typography >Értékelések kategóriákra lebontva (utolsó {period.start.fromNow(true)})
            </Typography>
            <ResponsiveContainer height={chartHeight} width="90%" >
              <RadarChart
                data={roomServiceData}
                style={{
                  fontFamily: "sans-serif",
                  fontSize: 10
                }}

              >
                <PolarGrid/>
                <PolarAngleAxis dataKey="name" />
                <PolarRadiusAxis angle={60} domain={[0, 5]} />
                {/* <Radar
                  dataKey="prev"
                  fill={colors.orange}
                  fillOpacity={0.9}
                  name="korábban"
                /> */}
                <Radar
                  dataKey="value"
                  fill={colors.lightBrown}
                  fillOpacity={0.9}
                  name="átlag"
                />
                <Tooltip/>
              </RadarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item md={8} sm={6} xs={12}>
          <Paper style={{padding: 16}}>
            <Typography >
              <Link style={{marginRight: 8}} to={toRoute(routes.ROOMS, roomId)}>Szoba {roomId}</Link>
             értékelése</Typography>
            {isLoading ? <Loading/> :
              <ResponsiveContainer height={chartHeight} width="100%">
                <AreaChart
                  data={roomData}
                  margin={{
                    top: 16,
                    left: 32,
                    right: 32
                  }}
                  style={{
                    fontFamily: "sans-serif",
                    fontSize: 12
                  }}
                >
                  <defs>
                    <linearGradient id={`color${roomId}`} x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor={colors[`room${roomId}`]} stopOpacity={0.8}/>
                      <stop offset="100%" stopColor={colors[`room${roomId}`]} stopOpacity={0.8}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name"/>
                  <YAxis
                    domain={[0, 5]}
                    hide
                  />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip wrapperStyle={{fontSize: 12}}/>
                  <Area
                    connectNulls
                    dataKey="átlag"
                    fill={`url(#color${roomId})`}
                    fillOpacity={1}
                    stroke={colors[`room${roomId}`]}
                    type="monotone"
                  />
                </AreaChart>
              </ResponsiveContainer>
            }

          </Paper>
        </Grid>
      </Grid>
    )
  }
}


export default withStore(Stats)