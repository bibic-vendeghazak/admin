import React from 'react'
import moment from 'moment'

import {
Grid, TextField, InputAdornment, Typography, Chip, Avatar, Hidden
} from '@material-ui/core'

import Search from '@material-ui/icons/SearchRounded'
import Calendar from '@material-ui/icons/EventRounded'


const ReservationsToolbar = ({
  from, to, onSearchChange, onDateChange, onRoomChange, query, roomsFilter
}) =>
  <Grid
    container
    style={{padding: "16px 16px 0 16px"}}
  >
    <TextField
      InputProps={{endAdornment: <InputAdornment><Search color="disabled"/></InputAdornment>}}
      fullWidth
      label="Keresés"
      name="query"
      onChange={onSearchChange}
      value={query}
    />
    <Grid
      alignItems="center"
      container
      item
      justify="space-between"
      spacing={16}
      style={{margin: "16px 0"}}
    >
      <Grid
        item
        lg={3}
        md={12}
      >
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
        <Grid
          item
          md={6}
          xs={12}
        >
          <TextField
            InputProps={{startAdornment: <InputAdornment position="start"><Calendar color="disabled"/></InputAdornment>,
              endAdornment: <InputAdornment position="end">tól</InputAdornment>}}
            fullWidth
            name="from"
            onChange={onDateChange}
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
            InputProps={{startAdornment: <InputAdornment position="start"><Calendar color="disabled"/></InputAdornment>,
              endAdornment: <InputAdornment position="end">ig</InputAdornment>}}
            fullWidth
            name="to"
            onChange={onDateChange}
            type="date"
            value={moment(to).format("YYYY-MM-DD")}
          />
        </Grid>
      </Grid>

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
          <Typography variant="subtitle1">
                Szoba szűrése
          </Typography>
        </Grid>
        <Grid
          container
          item
          justify="flex-end"
          md={9}
        >
          {roomsFilter
            .map((active, i) =>
              <Chip
                avatar={<Avatar>{i+1}</Avatar>}
                clickable
                color={active ? "primary": "default"}
                key={i}
                label={<Hidden mdDown>Szoba</Hidden>}
                name="roomId"
                onClick={() => onRoomChange(i, roomsFilter.length)}
                style={{margin: "0 4px"}}
              />
            )
          }
        </Grid>
      </Grid>
    </Grid>
  </Grid>

export default ReservationsToolbar