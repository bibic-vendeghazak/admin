import React from "react"
import PropTypes from "prop-types"
import {withStore} from "../../db"

import {Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button} from "@material-ui/core"

const EnhancedDialog = ({
  dialog: {
    open, title, content, submitLabel, cancelLabel
  }, closeDialog, acceptDialog
}) =>
  <Dialog
    onClose={closeDialog}
    open={open}
  >
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <DialogContentText>
        {content}
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button
        color="primary"
        onClick={closeDialog}
      >{cancelLabel}
      </Button>
      <Button
        autoFocus
        color="secondary"
        onClick={acceptDialog}
        variant="contained"
      >{submitLabel}
      </Button>
    </DialogActions>
  </Dialog>


EnhancedDialog.propTypes = {
  dialog: PropTypes.shape({
    open: PropTypes.bool,
    title: PropTypes.string,
    content: PropTypes.string,
    submitLabel: PropTypes.string,
    cancelLabel: PropTypes.string
  }),
  closeDialog: PropTypes.func,
  acceptDialog: PropTypes.func
}

export default withStore(EnhancedDialog)