import React from "react"
import PropTypes from "prop-types"
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

Logout.propTypes = {handleLogout: PropTypes.func}

export default withStore(Logout)
