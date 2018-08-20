import React, {Component} from 'react'
import moment from 'moment'

import {ROOMS_DB} from '../../../utils/firebase'
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

export default class Availability extends Component {

  state = {
    unavailable: null,
    unavailableTemp: null
  }

  componentDidMount() {
    ROOMS_DB.child(`${this.props.roomId-1}/unavailable`)
      .on("value", snap => this.setState({unavailable: snap.val()}))
  }

  handleChangeInput = ({target: {value}}) => this.setState({unavailableTemp: value})

  handleCancelBlock = () => {
    this.props.openDialog({
      content: "A szoba újra foglalható lesz.",
      submitLabel: "Feloldás"
    },
    () => ROOMS_DB
      .child(`${this.props.roomId-1}/unavailable`)
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
      .child(`${this.props.roomId-1}/unavailable`)
      .set(this.state.unavailableTemp),
    "A szoba blokkolva lett a megadott dátumig."
    )
  }

  render() {
    const {unavailable, unavailableTemp} = this.state
    const isUnavailable = moment(unavailable || undefined).startOf("day").isAfter(moment().startOf("day"))
    return (
      <Card>
        <CardContent>
          <Grid
            alignItems="center"
            container
            justify="space-between"
          >
            <Typography variant="body2">
              {isUnavailable ?
                "Blokkolva eddig" :
                "Nincs blokkolva"
              }
            </Typography>
            {isUnavailable ?
              <Typography>{moment(unavailable).format("YYYY. MMMM DD.")}</Typography> :
              <TextField
                onChange={this.handleChangeInput}
                type="date"
                value={moment(unavailableTemp || undefined).format("YYYY-MM-DD")}
              />
            }
          </Grid>
        </CardContent>
        <CardActions>
          <Grid
            container
            justify="flex-end"
          >
            {isUnavailable ?
              <Button
                color="primary"
                onClick={this.handleCancelBlock}
                size="small"
                variant="outlined"
              >
                <Unlock/>
                Feloldás
              </Button> :
              <Button
                color="secondary"
                onClick={this.handleSubmitDate}
                size="small"
                variant="contained"
              >
                <Lock/>
                Blokkol
              </Button>
            }
          </Grid>
        </CardActions>
      </Card>
    )
  }
}