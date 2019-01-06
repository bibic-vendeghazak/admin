import React, {Component} from "react"
import moment from "moment"
import {withRouter} from "react-router-dom"
import {Grid, TextField, InputAdornment, Typography, Chip, Avatar, Hidden} from "@material-ui/core"

import Calendar from "@material-ui/icons/EventRounded"
import {getQueryType} from "../../db/Store/search"


const withToolbar = WrappedComponent =>
  withRouter(class extends Component {

    static defaultProps = {
      showDateFilter: true,
      showRoomFilter: true
    }

    state = {
      queryType : "reservationsFilters"
    }

    componentDidMount() {
      this.setState({queryType: getQueryType(this.props.match.path)})
    }

    // NOTE: Can be used to show all rooms
    handleResetRooms = () => {
      this.props.changeRoom(this.state.queryType, [])
    }

    handleDate = ({target: {name, value}}) =>
      this.props.changeReservationsFilter(name, value === "" ? null : value)

    handleRoom = (roomId, roomsLength) => {

      const queryType = getQueryType(this.props.match.path)
      let filteredRooms = [...this.props[queryType].filteredRooms]
      filteredRooms = (filteredRooms.length ?
        filteredRooms :
        Array(roomsLength)
          .fill(true))
        .map((e, i) => i === roomId ? !e : e)

      this.props.changeRoom(queryType, filteredRooms)
    }


    render() {
      const {
        showQueryFilter, showDateFilter, showRoomFilter, rooms, ...props
      } = this.props
      const {from, to} = this.props.reservationsFilters
      const {filteredRooms} = this.props[this.state.queryType]
      return (
        <>
          <>
            <Grid
              container
              style={{padding: "0 16px"}}
            >
              <Grid
                alignItems="center"
                container
                item
                justify="space-between"
                spacing={8}
              >
                {showDateFilter &&
                  <>
                    <Grid item lg={3} md={12}>
                      <Typography variant="subtitle1">
                        Dátum szűrése
                      </Typography>
                    </Grid>
                    <Grid
                      container
                      item
                      justify="flex-end"
                      lg={9}
                      spacing={16}
                    >
                      <Grid item md={6} xs={12}>
                        <TextField
                          InputProps={{
                            startAdornment: <InputAdornment position="start"><Calendar color="disabled"/></InputAdornment>,
                            endAdornment: <InputAdornment position="end">tól</InputAdornment>
                          }}
                          fullWidth
                          name="from"
                          onChange={this.handleDate}
                          type="date"
                          value={moment(from).format("YYYY-MM-DD")}
                        />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <TextField
                          InputProps={{
                            startAdornment: <InputAdornment position="start"><Calendar color="disabled"/></InputAdornment>,
                            endAdornment: <InputAdornment position="end">ig</InputAdornment>
                          }}
                          fullWidth
                          name="to"
                          onChange={this.handleDate}
                          type="date"
                          value={moment(to).format("YYYY-MM-DD")}
                        />
                      </Grid>
                    </Grid>
                  </>
                }
                {showRoomFilter &&
                  <Grid
                    alignItems="center"
                    container
                    item
                    justify="space-between"
                    xs={12}
                  >
                    <Grid item md={3} xs={12}>
                      <Typography variant="subtitle1">
                        Szoba szűrése
                      </Typography>
                    </Grid>
                    <Grid
                      alignItems="center"
                      container
                      item
                      justify="flex-end"
                      md={9}
                    >
                      {rooms &&
                      (filteredRooms.length ?
                        filteredRooms :
                        Array(rooms.length)
                          .fill(true))
                        .map((active, i) =>
                          <Chip
                            avatar={<Avatar>{i+1}</Avatar>}
                            clickable
                            color={active ? "primary": "default"}
                            key={i}
                            label={<Hidden mdDown>Szoba</Hidden>}
                            name="roomId"
                            onClick={() => this.handleRoom(i, rooms.length)}
                            style={{margin: 2}}
                          />
                        )
                      }
                    </Grid>
                  </Grid>
                }
              </Grid>
            </Grid>
          </>
          <WrappedComponent {...props}/>
        </>
      )
    }
  })


export default withToolbar