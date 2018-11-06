import React from "react"
import {Grid} from "@material-ui/core"

import Room from "./Room"
import EditRoom from "./EditRoom"
import {Loading} from "../../shared"
import {withStore} from "../../App/Store"


export const Rooms = ({rooms, roomPictures, match: {params: {roomId}}}) =>
  roomId ?
    <EditRoom roomId={roomId}/> :
    <Grid container style={{padding: 8, maxWidth: 960}}>
      {rooms.length ? rooms.map(room =>
        <Grid item key={room.id} lg={4} sm={6} xs={12}>
          <Room {...room} pictures={roomPictures[room.id]}/>
        </Grid>) :
        <Loading/>
      }
    </Grid>

export default withStore(Rooms)