import React from "react"
import {
  Route, Link, Switch
} from "react-router-dom"
import {moment} from "../../lib"

import {routes, toRoute} from "../../utils"

import {
  Typography, IconButton, Tooltip, Switch as Toggle, FormControlLabel
} from "@material-ui/core"


import Close from "@material-ui/icons/CloseRounded"
import Today from "@material-ui/icons/TodayRounded"
import Next from "@material-ui/icons/NavigateNext"
import Before from "@material-ui/icons/NavigateBeforeRounded"
import Search from "./Search"

const {
  ROOMS, INTRO, CERTIFICATES,
  MESSAGES, CALENDAR, RESERVATIONS,
  FEEDBACKS, FOODS, EVENTS, SERVICES
} = routes

export const Title = () =>
  <Typography
    color="inherit"
    noWrap
    style={{flexGrow: 1}}
    variant="h6"
  >
    <Switch>
      <Route
        component={() => "Szobák"}
        path={ROOMS}
      />
      <Route
        component={() => "Bemutatkozás"}
        path={INTRO}
      />
      <Route
        component={() => "Tanúsítványok"}
        path={CERTIFICATES}
      />
      <Route
        component={
          ({match: {params: {p1}}}) =>
            p1 ? "Üzenet" : "Üzenetek"
        }
        path={toRoute(MESSAGES, ":p1?")}
      />
      <Route
        component={
          ({match: {params: {
            year, month, day
          }}}) => moment([year, month-1, day || "01"]).format(day ? "YYYY MMMM DD, dddd" : "YYYY MMMM")}
        path={toRoute(CALENDAR, ":year", ":month", ":day?")}
      />
      <Route
        component={({match: {params: {p1}}}) => p1 ? "Foglalás" : "Foglalások"}
        path={toRoute(RESERVATIONS, ":p1?")}
      />
      <Route
        component={() => "Statisztika / Visszajelzések (utolsó 100)"}
        path={FEEDBACKS}
      />
      <Route
        component={() => "Ételek galéria"}
        path={FOODS}
      />
      <Route
        component={() => "Rendezvények galéria"}
        path={EVENTS}
      />
      <Route
        component={() => "Szolgáltatások galéria"}
        path={SERVICES}
      />
      <Route component={() => "Admin kezelőfelület"}/>
    </Switch>
  </Typography>


const pathsWithClose = [ROOMS, RESERVATIONS, MESSAGES]

export const RightAction = () =>
  <Switch>
    {pathsWithClose.map(path =>
      <Route
        component={() => <CloseButton to={path}/>}
        key={path}
        path={toRoute(path, ":parameter")}
      />
    )}
    <Route component={Search} path={routes.RESERVATIONS}/>
    <Route component={Search} path={routes.MESSAGES}/>
    <Route
      component={({match: {params: {
        year, month, day
      }}}) => {
        const date = moment(new Date([year, month, day].join("/")))
        return (
          day ?
            <CloseButton to={toRoute(CALENDAR, year, month)}/> :
            <>
              <Tooltip title="Előző hónap">
                <IconButton
                  component={Link}
                  to={toRoute(CALENDAR, date.clone().add(-1, "month").format("YYYY/MM"))}
                >
                  <Before style={{color: "white"}}/>
                </IconButton>
              </Tooltip>
              <Tooltip title="Ugrás ide: ma">
                <IconButton
                  component={Link}
                  to={toRoute(CALENDAR, moment().format("YYYY/MM"))}
                >
                  <Today style={{color: "white",
                    margin: "0 32px"}}
                  />
                </IconButton>
              </Tooltip>
              <Tooltip title="Következő hónap">
                <IconButton
                  component={Link}
                  to={toRoute(CALENDAR, date.clone().add(1, "month").format("YYYY/MM"))}
                >
                  <Next style={{color: "white"}}/>
                </IconButton>
              </Tooltip>
            </>
        )}}
      path={toRoute(CALENDAR, ":year", ":month", ":day?")}
    />
    <Route
      component={({match: {params: {show}}, history}) => <ToggleStats history={history} show={show}/>}
      path={toRoute(FEEDBACKS, ":show?")}
    />
    <Route component={() => ""}/>
  </Switch>


const CloseButton = ({to}) =>
  <Tooltip title="Bezárás">
    <IconButton
      component={Link}
      {...{to}}
    >
      <Close style={{color: "white"}}/>
    </IconButton>
  </Tooltip>


const ToggleStats = ({history, show}) =>
  <FormControlLabel
    control={
      <Toggle
        checked={show}
        onChange={() => history.push(toRoute(FEEDBACKS, show ? "" : "stat"))}
      />
    }
    label={
      <Typography
        style={{color: "white"}}
        variant="subtitle2"
      >
      Statisztika {show ? "elrejése": "mutatása"}
      </Typography>
    }
    labelPlacement="start"
    style={{color: "white"}}
  />

