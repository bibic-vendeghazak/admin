import React from "react"

import {Button} from "@material-ui/core"


const Logout = ({handleLogout}) =>
  <div style={{
    display: "flex",
    justifyContent: "flex-end",
    margin: "1em"
  }}
  >
    <Button
      color="secondary"
      onClick={handleLogout}
      variant="contained"
    >
      Kijelentkezés
    </Button>
  </div>

export default Logout
