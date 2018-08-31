import React from "react"
import {Route, Link, Switch} from "react-router-dom"
import moment from 'moment'

import {routes, toRoute} from "../../utils"

import {Typography, IconButton, Tooltip} from '@material-ui/core'
import Close from "@material-ui/icons/CloseRounded"
import Today from "@material-ui/icons/TodayRounded"


export const Title = () =>
  <Typography
    color="inherit"
    noWrap
    style={{flexGrow: 1}}
    variant="title"
  >
    <Switch>
      <Route component={() => "Szobák"} path={routes.ROOMS}/>
      <Route component={() => "Bemutatkozás"} path={routes.INTRO}/>
      <Route component={() => "Tanúsítványok"} path={routes.CERTIFICATES}/>
      <Route
        component={
          ({match: {params: {p1}}}) =>
            p1 ? "Külön ajánlat" : "Külön ajánlatok"
        }
        path={toRoute(routes.SPECIAL_REQUESTS, ":p1")}
      />
      <Route
        component={
          ({match: {params: {
            year, month, day
          }}}) => moment([year, month-1, day || "01"]).format(day ? "YYYY MMMM DD, dddd" : "YYYY MMMM")}
        path={toRoute(routes.CALENDAR, ":year", ":month", ":day?")}
      />
      <Route component={({match: {params: {p1}}}) => p1 ? "Foglalás" : "Foglalások"} path={toRoute(routes.RESERVATIONS, ":p1?")}/>
      <Route component={() => "Statisztika / Üzenetek"} path={routes.FEEDBACKS}/>
      <Route component={() => "Ételek galéria"} path={routes.FOODS}/>
      <Route component={() => "Rendezvények galéria"} path={routes.EVENTS}/>
      <Route component={() => "Szolgáltatások galéria"} path={routes.SERVICES}/>
      <Route component={() => "Admin kezelőfelület"}/>
    </Switch>
  </Typography>


const pathsWithClose = [routes.ROOMS, routes.RESERVATIONS, routes.SPECIAL_REQUESTS]

export const RightAction = () =>
  <Switch>
    {pathsWithClose.map(path =>
      <Route
        component={() =>
          <CloseButton
            to={path}
          />}
        key={path}
        path={toRoute(path, ":parameter")}
      />
    )}
    <Route
      component={({match: {params: {
        year, month, day
      }}}) =>
        day ?
          <CloseButton to={toRoute(routes.CALENDAR, year, month)}/> :
          <Tooltip title="Ugrás ide: ma">
            <IconButton
              component={Link}
              to={toRoute(routes.CALENDAR, moment().format("YYYY/MM"))}
            >
              <Today style={{color: "white"}}/>
            </IconButton>
          </Tooltip>
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