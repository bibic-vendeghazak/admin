import React from "react"
import {Route, withRouter} from "react-router-dom"
import {ExtendedFAB, Tip} from "../../components/shared"
import {routes, toRoute} from "../../utils"
import {withStore} from "../../db"
import Reservation from './Reservation'
import {Paper} from "@material-ui/core"
import Bookmark from '@material-ui/icons/BookmarkBorderRounded'
import Validity from "./Validity"
import ReservationsTable from "./ReservationsTable"
import EditReservation from "../../components/EditReservation"


const Reservations = ({rooms}) =>
  <div>
    <Route
      exact
      path={routes.RESERVATIONS}
      render={() =>
        <>
          <Paper style={{paddingTop: 16}}>
            <ReservationsTable/>
          </Paper>
          <Tip>A foglalások sorbarendezhetőek az oszlopcímekre kattintva.</Tip>
          <Tip>Az új foglalások mindig a lista tetején jelennek meg.</Tip>
          <ExtendedFAB
            icon={<Bookmark/>}
            label="Új foglalás"
            to={toRoute(routes.RESERVATIONS, routes.NEW)}
          />
        </>
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
          isDetailed
          promptTitle="Menti a változtatásokat?"
          shouldPrompt
          submitLabel="Mentés"
          success="Foglalás sikeresen frissítve!"
          title="Foglalás szerkesztése"
        />
      }
    />
    <Route
      exact
      path={toRoute(routes.RESERVATIONS, routes.NEW)}
      render={props =>
        <EditReservation
          {...{rooms, ...props}}
          error="Sikertelen foglalás! Kérjük ellenőrizze az adatokat."
          promptTitle="Biztosan felveszi ezt a foglalást?"
          shouldPrompt
          submitLabel="Felvétel"
          success="Foglalás sikeresen felvéve!"
          title="Foglalás felvétele"
        />
      }
    />
  </div>


export default withRouter(withStore(Reservations))