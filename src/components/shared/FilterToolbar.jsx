import React, {Fragment, Component} from "react"
import moment from "moment"

import {Grid, TextField, InputAdornment, Typography, Chip, Avatar, Hidden} from "@material-ui/core"

import Search from "@material-ui/icons/SearchRounded"
import Calendar from "@material-ui/icons/EventRounded"


const withToolbar = WrappedComponent =>
  class extends Component {

    static defaultProps = {
      showQueryFilter: true,
      showDateFilter: true,
      showRoomFilter: true
    }

    state = {
      from: moment().add(-1, "week").startOf("day"),
      to: moment().add(2, "months"),
      query: [""],
      filteredRooms: []
    }

    handleSearch = ({target: {value}}) =>
      this.setState({query: value.toLowerCase().split(" ")})

    handleDate = ({target: {
      name, value
    }}) => {
      this.setState({[name]: value === "" ? null : value})
    }

    handleRoom = (roomId, roomsLength) =>
      this.setState(({filteredRooms}) =>
        ({filteredRooms: (filteredRooms.length ?
          filteredRooms :
          Array(roomsLength)
            .fill(true))
          .map((e, i) => i === roomId ? !e : e)})
      )

    render() {
      const {
        from, to, query, filteredRooms
      } = this.state
      const {
        showQueryFilter, showDateFilter, showRoomFilter, rooms, ...props
      } = this.props
      return (
        <Fragment>
          <Fragment>
            <Grid
              container
              style={{padding: "16px 16px 0 16px"}}
            >
              {showQueryFilter &&
                <TextField
                  InputProps={{endAdornment: <InputAdornment><Search color="disabled"/></InputAdornment>}}
                  fullWidth
                  label="Keresés"
                  name="query"
                  onChange={this.handleSearch}
                  value={query}
                />
              }
              <Grid
                alignItems="center"
                container
                item
                justify="space-between"
                spacing={16}
                style={{margin: "16px 0"}}
              >
                {showDateFilter &&
                  <Fragment>
                    <Grid
                      item
                      lg={3}
                      md={12}
                    >
                      <Typography variant="subheading">
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
                      <Grid
                        item
                        md={6}
                        xs={12}
                      >
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
                      <Grid
                        item
                        md={6}
                        xs={12}
                      >
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
                  </Fragment>
                }
                {showRoomFilter &&
                  <Grid
                    alignItems="center"
                    container
                    item
                    justify="space-between"
                    xs={12}
                  >
                    <Grid
                      item
                      md={3}
                      xs={12}
                    >
                      <Typography variant="subheading">
                        Szoba szűrése
                      </Typography>
                    </Grid>
                    <Grid
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
                            style={{margin: "0 4px"}}
                          />
                        )
                      }
                    </Grid>
                  </Grid>
                }
              </Grid>
            </Grid>
          </Fragment>
          <WrappedComponent
            {...{
              ...props,
              ...this.state
            }}
          />
        </Fragment>
      )
    }
  }


export default withToolbar