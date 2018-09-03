import React, {Fragment} from "react"
import {Route, Link, Switch} from "react-router-dom"
import moment from "moment"

import {routes, toRoute} from "../../utils"

import {Typography, IconButton, Tooltip} from "@material-ui/core"
import Close from "@material-ui/icons/CloseRounded"
import Today from "@material-ui/icons/TodayRounded"
import Next from "@material-ui/icons/NavigateNext"
import Before from "@material-ui/icons/NavigateBeforeRounded"

const {
  ROOMS, INTRO, CERTIFICATES,
  SPECIAL_REQUESTS, CALENDAR, RESERVATIONS,
  FEEDBACKS, FOODS, EVENTS, SERVICES
} = routes

export const Title = () =>
  <Typography color="inherit" noWrap style={{flexGrow: 1}} variant="title">
    <Switch>
      <Route component={() => "Szobák"} path={ROOMS}/>
      <Route component={() => "Bemutatkozás"} path={INTRO}/>
      <Route component={() => "Tanúsítványok"} path={CERTIFICATES}/>
      <Route
        component={
          ({match: {params: {p1}}}) =>
            p1 ? "Külön ajánlat" : "Külön ajánlatok"
        }
        path={toRoute(SPECIAL_REQUESTS, ":p1?")}
      />
      <Route
        component={
          ({match: {params: {
            year, month, day
          }}}) => moment([year, month-1, day || "01"]).format(day ? "YYYY MMMM DD, dddd" : "YYYY MMMM")}
        path={toRoute(CALENDAR, ":year", ":month", ":day?")}
      />
      <Route component={({match: {params: {p1}}}) => p1 ? "Foglalás" : "Foglalások"} path={toRoute(RESERVATIONS, ":p1?")}/>
      <Route component={() => "Statisztika / Üzenetek"} path={FEEDBACKS}/>
      <Route component={() => "Ételek galéria"} path={FOODS}/>
      <Route component={() => "Rendezvények galéria"} path={EVENTS}/>
      <Route component={() => "Szolgáltatások galéria"} path={SERVICES}/>
      <Route component={() => "Admin kezelőfelület"}/>
    </Switch>
  </Typography>


const pathsWithClose = [ROOMS, RESERVATIONS, SPECIAL_REQUESTS]

export const RightAction = () =>
  <Switch>
    {pathsWithClose.map(path =>
      <Route
        component={() => <CloseButton to={path}/>}
        key={path}
        path={toRoute(path, ":parameter")}
      />
    )}
    <Route
      component={({match: {params: {
        year, month, day
      }}}) => {
        const date = moment(new Date([year, month, day].join("/")))
        return (
          day ?
            <CloseButton to={toRoute(routes.CALENDAR, year, month)}/> :
            <Fragment>
              <Tooltip title="Előző hónap">
                <IconButton
                  component={Link}
                  to={toRoute(routes.CALENDAR, date.clone().add(-1, "month").format("YYYY/MM"))}
                >
                  <Before style={{color: "white"}}/>
                </IconButton>
              </Tooltip>
              <Tooltip title="Ugrás ide: ma">
                <IconButton
                  component={Link}
                  to={toRoute(routes.CALENDAR, moment().format("YYYY/MM"))}
                >
                  <Today style={{
                    color: "white",
                    margin: "0 32px"
                  }}
                  />
                </IconButton>
              </Tooltip>
              <Tooltip title="Következő hónap">
                <IconButton
                  component={Link}
                  to={toRoute(routes.CALENDAR, date.clone().add(1, "month").format("YYYY/MM"))}
                >
                  <Next style={{color: "white"}}/>
                </IconButton>
              </Tooltip>

            </Fragment>

        )
      }
      }
      path={toRoute(routes.CALENDAR, ":year", ":month", ":day?")}
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

