import React, {Component} from 'react'

import {moment} from '../../lib'
import {ROOMS_DB} from '../../lib/firebase'
import {
  TextField,
  Grid,
  Button,
  Typography,
  CardActions,
  Card,
  CardContent
} from '@material-ui/core'

import Lock from '@material-ui/icons/LockRounded'
import Unlock from '@material-ui/icons/LockOpenRounded'
import {TODAY} from '../../lib/moment'
import hu from "../../lang/hu"


export default class Availability extends Component {

  state = {
    unavailable: undefined,
    value: undefined
  }

  componentDidMount() {
    ROOMS_DB.child(`${this.props.roomId}/unavailable`)
      .on("value", snap => this.setState({unavailable: snap.val()}))
  }

  handleChangeInput = ({target: {value}}) => this.setState({value})

  handleCancelBlock = () => {
    this.props.openDialog({
      submitLabel: "Feloldás",
      content: "A szoba újra foglalható lesz."
    },
    () => ROOMS_DB
      .child(`${this.props.roomId}/unavailable`)
      .remove(),
    "Blokkolás feloldva. A szoba újra foglalható."
    )
  }

  handleSubmitDate = () => {
    this.props.openDialog({
      submitLabel: "Blokkolás",
      content: "A szoba foglalása blokkolva lesz az adott dátumig."
    },
    () => ROOMS_DB
      .child(`${this.props.roomId}/unavailable`)
      .set(this.state.value),
    "A szoba blokkolva lett a megadott dátumig."
    )
  }

  render() {
    const {value} = this.state
    let {unavailable} = this.state
    unavailable = moment(unavailable)
    const isUnavailable = TODAY.isBefore(unavailable, "day")
    return (
      <Card>
        <CardContent>
          <Grid alignItems="center" container justify="space-between">
            <Typography variant="body2">
              {isUnavailable ?
                hu.rooms.editRoom.sections.availability.blockedUntil :
                hu.rooms.editRoom.sections.availability.available
              }
            </Typography>
            {isUnavailable ?
              <Typography>{unavailable.clone().format("YYYY. MMMM DD.")}</Typography> :
              <TextField
                onChange={this.handleChangeInput}
                type="date"
                value={moment(value).format("YYYY-MM-DD")}
              />
            }
          </Grid>
        </CardContent>
        <CardActions>
          <Grid container justify="flex-end">
            {isUnavailable ?
              <Button
                color="primary" onClick={this.handleCancelBlock}
                size="small" variant="outlined"
              >
                <Unlock/> {hu.rooms.editRoom.sections.availability.buttons.block}
              </Button> :
              <Button
                color="secondary" onClick={this.handleSubmitDate}
                size="small" variant="contained"
              >
                <Lock/> {hu.rooms.editRoom.sections.availability.buttons.unblock}
              </Button>
            }
          </Grid>
        </CardActions>
      </Card>
    )
  }
}