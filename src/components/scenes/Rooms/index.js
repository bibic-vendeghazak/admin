import React, {Fragment} from "react"
import {Route} from "react-router-dom"
import {withStore} from "../../App/Store"

import Room from "./Room"
import EditRoom from "./EditRoom"
import {routes, toRoute} from "../../../utils"
import {Grid} from "@material-ui/core"
import {Loading} from "../../shared"


const Rooms = ({
  rooms, roomPictures
}) =>
  <Fragment>
    <Route
      exact
      path={routes.ROOMS}
      render={() =>
        <Grid
          container
          style={{
            padding: 8,
            maxWidth: 960
          }}
        >
          {rooms.length ? rooms.map(({
            key, unavailable, name, isBooked, id
          }) =>
            <Grid
              item
              key={key}
              lg={4}
              sm={6}
              xs={12}
            >
              <Room
                pictures={roomPictures[id] ? roomPictures[id] : null}
                {...{
                  unavailable,
                  name,
                  isBooked,
                  id
                }}
              />
            </Grid>) : <Loading/>
          }
        </Grid>
      }
    />
    <Route
      component={EditRoom}
      path={toRoute(routes.ROOMS, ":roomId")}
    />
  </Fragment>


export default withStore(Rooms)