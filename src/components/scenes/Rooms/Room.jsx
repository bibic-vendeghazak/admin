import React from "react"
import {Link} from "react-router-dom"
import {Button, Card, CardActions, CardMedia, Typography, Grid, Tooltip} from "@material-ui/core"
import empty from "../../../assets/empty-state.svg"
import {routes, toRoute} from "../../../utils"
import hu from "../../../lang/hu"

export const Room = ({
  unavailable, isBooked, id, name, pictures
}) =>
  <Card style={{margin: 8}}>
    <Tooltip
      title={
        unavailable ?
          hu.rooms.room.unavailable.long :
          isBooked ?
            hu.rooms.room.booked.yes.long :
            hu.rooms.room.booked.no.long
      }
    >
      <CardMedia
        image={pictures ? Object.values(pictures).find(({order}) => !order).SIZE_640 : empty}
        style={{paddingTop: "56.25%"}} // 16:9
      />
    </Tooltip>
    <CardActions>
      <Grid
        alignItems="center"
        container
        justify="space-between"
      >
        <Grid
          alignItems="baseline"
          container
          item
          xs={6}
        >
          <Typography variant="body1">{name} •</Typography>
          <Typography
            color={unavailable || isBooked ? "error" : "textPrimary"}
            style={{
              fontStyle: "italic",
              marginLeft: 4
            }}
            variant="body2"
          >
            {unavailable ?
              hu.rooms.room.unavailable.short :
              isBooked ?
                hu.rooms.room.booked.yes.short :
                hu.rooms.room.booked.no.short
            }
          </Typography>
        </Grid>
        <Grid
          container
          item
          justify="flex-end"
          xs={6}
        >
          <Button
            component={Link}
            to={toRoute(routes.ROOMS, id)}
            variant="outlined"
          >
            {hu.button.details}
          </Button>
        </Grid>
      </Grid>
    </CardActions>
  </Card>

export default Room