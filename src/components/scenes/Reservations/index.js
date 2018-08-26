import React, {Fragment} from "react"
import {Route, withRouter} from "react-router-dom"
import EditReservation from "./EditReservation"
import {ExtendedFAB, Tip} from "../../shared"
import {routes, toRoute} from "../../../utils"
import {withStore} from "../../App/Store"
import Reservation from './Reservation'
import {Paper} from "@material-ui/core"
import Bookmark from '@material-ui/icons/BookmarkBorderRounded'
import Validity from "./Validity"
import ReservationsTable from "./ReservationsTable"

const Reservations = ({rooms}) =>
  <div>
    <Route
      exact
      path={routes.RESERVATIONS}
      render={() =>
        <Fragment>
          <Paper style={{paddingTop: 16}}>
            <Tip>A foglalások sorbarendezhetőek az oszlopcímekre kattintva.</Tip>
            <Tip>Az új foglalások mindig a lista tetején jelennek meg.</Tip>
            <ReservationsTable/>
          </Paper>
          <ExtendedFAB
            icon={<Bookmark/>}
            label="Új foglalás"
            to={toRoute(routes.RESERVATIONS, routes.NEW)}
          />
        </Fragment>
      }
    />
    <Route
      component={Validity}
      exact
      path={toRoute(routes.RESERVATIONS, ":reservationId", routes.IS_VALID)}
    />
    <Route
      component={Reservation}
      path={toRoute(routes.RESERVATIONS, ":reservationId")}
    />
    <Route
      exact
      path={toRoute(routes.RESERVATIONS, ":reservationId", routes.EDIT)}
      render={props =>
        <EditReservation
          {...props}
          error="A foglalást nem tudtuk frissíteni. Kérjük ellenőrizze az adatokat."
          isFullReservation
          promptTitle="Menti a változtatásokat?"
          sendNotification={this.props.sendNotification}
          shouldPrompt
          submitLabel="Mentés"
          success="Foglalás sikeresen frissítve!"
          title="Foglalás részletei"
        />
      }
    />
    <Route
      exact
      path={toRoute(routes.RESERVATIONS, routes.NEW)}
      render={props =>
        <EditReservation
          {...{
            rooms,
            ...props
          }}
          error="Sikertelen foglalás! Kérjük ellenőrizze az adatokat."
          promptTitle="Biztosan felveszi ezt a foglalást?"
          sendNotification={this.props.sendNotification}
          shouldPrompt
          submitLabel="Felvétel"
          success="Foglalás sikeresen felvéve!"
          title="Foglalás felvétele"
        />
      }
    />
  </div>


export default withRouter(withStore(Reservations))