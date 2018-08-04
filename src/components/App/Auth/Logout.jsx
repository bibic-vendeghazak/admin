import React from "react"

import {RaisedButton} from "material-ui"


const Logout = ({handleLogout}) => (
  <div style={{
    display: "flex",
    justifyContent: "flex-end",
    margin: "1em"
  }}
  >
    <RaisedButton
      label="Kijelentkezés"
      onClick={handleLogout}
      secondary
    />
  </div>
)

export default Logout
