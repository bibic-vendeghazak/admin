import React from "react"
import {Button} from "@material-ui/core"
import {withStore} from "../Store"

const Logout = ({handleLogout}) =>
  <Button
    color="secondary"
    onClick={handleLogout}
    variant="contained"
  >
    Kijelentkezés
  </Button>

export default withStore(Logout)
