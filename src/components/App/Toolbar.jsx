import React from "react"
import {Route, Switch} from "react-router-dom"
import moment from 'moment'

import {routes, toRoute} from "../../utils"

import {Typography} from '@material-ui/core'

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
      <Route component={() => "Akciós ajánlatok"} path={routes.SPECIAL_OFFER}/>
      <Route
        component={
          ({match: {params: {
            year, month, day
          }}}) => moment([year, month-1, day || "01"]).format(day ? "YYYY MMMM DD, dddd" : "YYYY MMMM")}
        path={toRoute(routes.CALENDAR, ":year", ":month", ":day?")}
      />
      <Route component={({match: {params: {p1}}}) => p1 ? "Foglalás" : "Foglalások"} path={toRoute(routes.RESERVATIONS, ":p1?")}/>
      <Route component={() => "Visszajelzések"} path={routes.FEEDBACKS}/>
      <Route component={() => "Ételek"} path={routes.FOODS}/>
      <Route component={() => "Rendezvények"} path={routes.EVENTS}/>
      <Route component={() => "Szolgáltatásaink"} path={routes.SERVICES}/>
      <Route component={() => "Statisztikák"} path={routes.STATS}/>
      <Route component={() => "Admin kezelőfelület"}/>
    </Switch>
  </Typography>

export const RightAction = () =>
  <Switch>
    <Route component={() => ""} path={routes.ROOMS}/>
    <Route component={() => ""} path={routes.INTRO}/>
    <Route component={() => ""} path={routes.CERTIFICATES}/>
    <Route component={() => ""} path={routes.SPECIAL_OFFER}/>
    <Route
      component={() => ""}
      path={toRoute(routes.CALENDAR, ":year", ":month", ":day?")}
    />
    <Route component={() => ""} path={routes.RESERVATIONS}/>
    <Route component={() => ""} path={routes.FEEDBACKS}/>
    <Route component={() => ""} path={routes.FOODS}/>
    <Route component={() => ""} path={routes.EVENTS}/>
    <Route component={() => ""} path={routes.SERVICES}/>
    <Route component={() => ""} path={routes.STATS}/>
    <Route component={() => ""}/>
  </Switch>