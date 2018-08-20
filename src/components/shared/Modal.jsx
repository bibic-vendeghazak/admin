import React, {Component} from "react"
import {withRouter} from 'react-router-dom'
import PropTypes from 'prop-types'


import {Dialog, Button, DialogActions, DialogTitle, DialogContent} from '@material-ui/core'
import {withStore} from "../App/Store"

class Modal extends Component {

  state = {fullScreen: true}

  componentDidMount() {
    window.addEventListener("resize", this.handleResize, false)
    this.handleResize()
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize, false)
  }

  handleResize = () => this.setState({fullScreen: window.innerWidth <= 540})

  handleClose = () => {
    const {
      history, successPath
    } = this.props
    history.push(successPath ||
      history.location.pathname
        .split("/")
        .slice(0, -1)
        .join("/"))
  }

  handleSubmit = () => {
    const {
      shouldPrompt, openDialog, promptTitle,
      remainOpen, sendNotification, onSubmit, success
    } = this.props

    if (shouldPrompt) {
      openDialog(
        {title: promptTitle || "Biztos benne?"},
        onSubmit,
        success, () => !remainOpen && this.handleClose()
      )
    } else {
      onSubmit()
        .then(() => {
          !remainOpen && this.handleClose()
          sendNotification({
            code: "success",
            message: success
          })
        })
        .catch(sendNotification)
    }
  }

  render() {
    const {
      cancelLabel, submitLabel, onSubmitDisabled, children,
      title, style
    } = this.props

    return (
      <Dialog
        fullScreen={this.state.fullScreen}
        onClose={this.handleClose}
        open
        {...{style}}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>{children}</DialogContent>
        <DialogActions>
          <Button
            color="primary"
            onClick={this.handleClose}
            variant="flat"
          >
            {cancelLabel || "Mégse"}
          </Button>
          <Button
            color="secondary"
            disabled={onSubmitDisabled}
            onClick={this.handleSubmit}
            variant="contained"
          >
            {submitLabel || "Igen"}
          </Button>
        </DialogActions>
      </Dialog>

    )
  }
}
export default withRouter(withStore(Modal))


/*
 *
 * PropTypes
 *
 */
Modal.propTypes = {
  shouldPrompt: PropTypes.bool,
  promptTitle: PropTypes.string,
  successPath: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  success: PropTypes.string.isRequired,
  error: PropTypes.string.isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired
}