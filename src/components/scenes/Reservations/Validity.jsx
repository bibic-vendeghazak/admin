import React, {Component} from 'react'
import {Grid, Typography, Tooltip, Card, CardHeader, CardActions, IconButton} from '@material-ui/core'
import {Link} from 'react-router-dom'
import {RESERVATIONS_FS} from "../../../lib/firebase"
import {Loading, Background} from '../../shared'
import {routes, toRoute, colors} from '../../../utils'

import Valid from '@material-ui/icons/CheckRounded'
import Invalid from '@material-ui/icons/CloseRounded'
import Back from '@material-ui/icons/ArrowForwardRounded'

export default class Validity extends Component {

  state = {
    loading: false,
    isValid: false,
    error: null
  }

  componentDidMount() {
    this.setState({loading: true})
    RESERVATIONS_FS
      .doc(this.props.match.params.reservationId)
      .get()
      .then(snap => this.setState({
        isValid: snap.exists && snap.data().handled,
        loading: false
      }))
      .catch(error => this.setState({error}))
  }

  render() {
    const {
      loading, isValid, error
    } = this.state
    return(
      <Grid
        alignItems="center"
        container
        justify="center"
        style={{minHeight: "calc(100vh - 64px)"}}
      >
        <Card style={{minWidth: 300}}>
          {loading ? <Loading/> :
            <CardHeader title={
              error ? <Typography variant="title">Hiba: {`${error.code}: ${error.message}`}</Typography> :
                <Grid alignItems="center" container justify="space-between">
                  <Typography variant="title">
                    {isValid ? "Érvényes" : "Érvénytelen"} foglalás
                  </Typography>
                  <Background color={isValid ? colors.green : colors.red}>
                    {isValid ? <Valid/> : <Invalid/>}
                  </Background>
                </Grid>
            }
            />
          }
          <CardActions>
            <Grid container justify="flex-end">
              <Tooltip title={isValid ? "A foglaláshoz" : "A foglalásokhoz"}>
                <IconButton
                  color="primary"
                  component={Link}
                  to={isValid ? toRoute(routes.RESERVATIONS, this.props.match.params.reservationId) : routes.RESERVATIONS}
                >
                  <Back/>
                </IconButton>
              </Tooltip>
            </Grid>

          </CardActions>
        </Card>
      </Grid>

    )
  }
}
