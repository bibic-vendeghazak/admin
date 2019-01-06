import React from "react"
import {Grid} from "@material-ui/core"

import Room from "./Room"
import {Loading} from "../../components/shared"
import {withStore} from "../../db"
import EditRoom from "../../components/EditRoom"


export const Rooms = ({rooms, roomPictures, match: {params: {roomId}}}) =>
  roomId ?
    <EditRoom roomId={parseInt(roomId,10) - 1}/> :
    <Grid container style={{padding: 8, maxWidth: 960, margin: "0 auto"}}>
      {rooms.length ? rooms.map(room =>
        <Grid item key={room.id} lg={4} sm={6} xs={12}>
          <Room {...room} pictures={roomPictures[room.id]}/>
        </Grid>) :
        <Loading/>
      }
    </Grid>

export default withStore(Rooms)