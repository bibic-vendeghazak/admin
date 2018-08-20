import React from 'react'
import {withStore} from "./Store"

import {Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button} from '@material-ui/core'


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


/*
 * Dialog.propTypes = {dialog: {
 *   open: PropTypes.boolean,
 *   title: PropTypes.string,
 *   content: PropTypes.string,
 *   submitLabel: PropTypes.string,
 *   cancelLabel: PropTypes.string
 * }}
 */

export default withStore(EnhancedDialog)