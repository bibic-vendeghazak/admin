import React from "react"
import {withStore} from "../../db"

import {Snackbar} from "@material-ui/core"
import Done from "@material-ui/icons/DoneRounded"
import Error from "@material-ui/icons/ErrorRounded"
import {colors} from "../../utils"
import {Background} from "../shared"


const Notification = ({
  notification: {
    open, message: {
      message, code
    }, duration
  },
  closeNotification
}) => {
  const isSuccess = code==="success"
  return (
    <Snackbar
      action={
        <Background color={isSuccess ? colors.green : colors.red}>
          {isSuccess ? <Done/> : <Error/>}
        </Background>
      }
      autoHideDuration={duration || 5000}
      onClose={closeNotification}
      open={open}
      {...{
        message,
        code
      }}
    />
  )
}

export default withStore(Notification)