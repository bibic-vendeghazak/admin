import React, {Component} from "react"

import {Snackbar} from "material-ui"

import Error from "material-ui/svg-icons/alert/error"
import Success from "material-ui/svg-icons/action/check-circle"
import Warning from "material-ui/svg-icons/alert/warning"

import {colors} from "../../../utils"
import {SERVER_MESSAGE_DB} from "../../../utils/firebase"
const {
  red, yellow, green
} = colors

const errorTypes = {
  "auth/invalid-email": "Hibás e-mail cím",
  "auth/user-not-found": "A felhasználó nem található",
  "auth/wrong-password": "Hibás jelszó",
  "auth/network-request-failed": "Kérem ellenőrizze az internet kapcsolatot.",
  "auth/too-many-requests": "Túl sok próbálkozás. Kérem próbálkozzon később."
}


export default class Notifications extends Component {

  state = {
    isNotificationOpen: false,
    message: ""
  }

  UNSAFE_componentWillReceiveProps({isNotificationOpen}) {
    this.setState({isNotificationOpen})
  }

  handleNotificationClose = () => {
    this.props.errorType === "server" &&
    SERVER_MESSAGE_DB
      .set({
        message: "",
        type: "",
        newId: "",
        oldId: ""
      })
    this.props.handleNotificationClose()
  }

  render() {
    const {
      notificationMessage, notificationType, errorType
    } = this.props
    const {isNotificationOpen} = this.state

    return(
      <Snackbar
        autoHideDuration={5000}
        message={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              margin: "0 6px"
            }}
          >
            <p style={{paddingRight: 6}}>{!errorType || errorType==="server" ? notificationMessage : errorTypes[errorType] || `Hiba kód: ${errorType}`}</p>
            {{
              error: <Error color={red}/>,
              warning: <Warning color={yellow}/>,
              success: <Success color={green}/>
            }[notificationType]}
          </div>
        }
        onRequestClose={() => this.handleNotificationClose()}
        open={isNotificationOpen}
      />
    )
  }
}