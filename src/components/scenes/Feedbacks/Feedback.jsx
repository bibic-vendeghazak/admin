import React, {Component, Fragment} from 'react'
import moment from 'moment'
import {TableRow, TableCell, Tooltip, Button, Grid, IconButton, Hidden} from "@material-ui/core"
import {Background} from "../../shared"
import New from '@material-ui/icons/NewReleasesRounded'
import {translateService} from './Stats/mutations'
import Close from '@material-ui/icons/CloseRounded'
import Delete from '@material-ui/icons/DeleteRounded'
import Done from '@material-ui/icons/DoneRounded'
import {colors} from '../../../utils'
import {withStore} from '../../App/Store'
import {FEEDBACKS_FS} from '../../../utils/firebase'
import Star from "@material-ui/icons/Star"

class Feedback extends Component {

  state = {showRatings: false}

  handleRatingsToggle = () =>
    this.setState(({showRatings}) => ({showRatings: !showRatings}))

  handleAcceptFeedback = () => {
    this.props.openDialog(
      {title: "Jóváhagyja ezt a visszajelzést?"},
      () => FEEDBACKS_FS.doc(this.props.id).update({accepted: true}),
      "Visszajelzés jóváhagyva"
    )
  }

  handleDeleteFeedback = () => {
    this.props.openDialog(
      {title: "Törli ezt a visszajelzést?"},
      () => FEEDBACKS_FS.doc(this.props.id).delete(),
      "Visszajelzés törölve"
    )
  }

  render() {
    const {showRatings} = this.state
    const {
      roomId, ratings, accepted, message, timestamp
    } = this.props
    return (
      <TableRow
        onClick={this.handleRatingsToggle}
        style={{cursor: "pointer"}}
      >
        <Hidden mdDown>
          <TableCell padding="checkbox">
            {!accepted ?
              <Tooltip title="Kezeletlen visszajelzés">
                <New color="secondary"/>
              </Tooltip> : null
            }
          </TableCell>
          <TableCell numeric padding="dense">
            <Background color={colors[`room${roomId}`]}>
              {roomId}
            </Background>
          </TableCell>
        </Hidden>
        <TableCell padding="dense">
          {showRatings ?
            <Grid
              container
              direction="column"

              spacing={8}
            >
              {Object.entries(ratings)
                .map(([name, value]) =>
                  <Grid item key={name}>
                    <Tooltip title={value}>
                      <Grid alignItems="center" container>
                        {translateService(name)}:
                        {Array(5).fill().map((star,i) => <Star key={i} style={{color: i < value ? colors.yellow : colors.grey}}/>)}
                      </Grid>
                    </Tooltip>
                  </Grid>
                )}
            </Grid> :
            <Tooltip title={`Beküldve: ${moment(new Date(timestamp)).fromNow()}`}>
              <span
                style={{maxWidth: "50vw"}}
              >{message}</span>
            </Tooltip>
          }

        </TableCell>
        <TableCell numeric padding="dense">
          <Grid alignItems="center" container justify="flex-end" wrap="nowrap">
            <Hidden mdDown>
              <Tooltip title={showRatings ? "értékelések elrejtése" : "értékelések mutatása"}>
                <IconButton>
                  {showRatings ? <Close/> : <Star/>}
                </IconButton>
              </Tooltip>
            </Hidden>
            <Tooltip title="visszajelzés törlése">
              <IconButton
                color="secondary"
                onClick={this.handleDeleteFeedback}
                variant="contained"
              >
                <Delete/>
              </IconButton>
            </Tooltip>
            {!accepted &&
                <Fragment>
                  <Hidden mdDown>
                    <Button
                      color="primary"
                      onClick={this.handleAcceptFeedback}
                      variant="contained"
                    >
                      Elfogad
                    </Button>
                  </Hidden>
                  <Hidden mdUp>
                    <IconButton
                      color="primary"
                      onClick={this.handleAcceptFeedback}
                    >
                      <Done/>
                    </IconButton>
                  </Hidden>
                </Fragment>
            }
          </Grid>
        </TableCell>
      </TableRow>
    )
  }
}

export default withStore(Feedback)