import React, {Component} from "react"

import {Grid, TextField} from '@material-ui/core'

import {Modal} from "../shared"
import {withStore} from "../../db"
import {RESERVATIONS_FS} from "../../lib/firebase"
import {valid} from "../../utils/validate"

export class DeleteReservation extends Component {

  state = {
    message: ""
  }

  handleChange = ({target :{name, value}}) => this.setState({[name]: value})

  handleDelete = async () => {
    try {
      const deleteReason = this.state.message
      const {reservationId} = this.props.match.params
      if(valid.deleteReason(deleteReason)) {
        await RESERVATIONS_FS.doc(reservationId).update({
          deleteReason: this.state.message
        })
      }
      await RESERVATIONS_FS.doc(reservationId).delete()
      return Promise.resolve(true)
    } catch (error) {
      this.props.sendNotification(error)
    }
  }

  render() {
    const {
      message
    } = this.state
    const {
      error, submitLabel, success, successPath,
      title, shouldPrompt, promptTitle
    } = this.props
    return (
      <Modal
        onSubmit={this.handleDelete}
        title={title}
        {...{error, submitLabel, success, successPath, shouldPrompt, promptTitle}}
      >
        <Grid container spacing={16}>
          <TextField
            fullWidth
            multiline
            name="message"
            onChange={this.handleChange}
            placeholder="A törlés indoka"
            rows={4}
            style={{minWidth: 320}}
            value={message}
          />
        </Grid>
      </Modal>
    )
  }
}

export default withStore(DeleteReservation)