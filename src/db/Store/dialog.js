
export const dialog = {
  open: false,
  title: "Biztos benne, hogy folytatni akarja?",
  content: "",
  cancelLabel: "Mégse",
  submitLabel: "Igen"
}

/**
  * @param {object} dialog The dialogs title, content, and button labels.
  * @param {Promise} submit The action to be called if the dialog is accepted.
  * @param {string} success After submitting, a notification is sent.
  * This, or the error message is the content.
  * @param {func} handleClose The function to be called when the dialog will
  * be closed
  * @return {null} .
  */
export function openDialog(newDialog, submit, success, handleClose) {
  this.setState(({dialog: prevDialog}) => ({
    dialog: {
      ...prevDialog,
      ...newDialog,
      open: true
    },
    acceptDialog: async () => {
      try {
        handleClose && handleClose()
        this.sendNotification({code: "success", message: success})
        await submit()
      } catch (error) {
        this.sendNotification(error)
      } finally {
        this.closeDialog()
      }
    }
  }))
}

/**
 * Close the dialog, and reset it to
 * the initial dialog data.
 */
export function closeDialog() {
  /*
   * NOTE: To prevent text flickering, first, only
   * the open state is changed, then the rest of the dialog.
   */
  this.setState(({dialog: prevDialog}) => ({
    dialog: {...prevDialog, open: false}
  }))
  setTimeout(() => this.setState({dialog}), 1000)
}