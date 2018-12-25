
import React from "react"
import {Link} from "react-router-dom"

import {Fab} from "@material-ui/core"

const ExtendedFAB = ({
  icon, label, ...props
}) =>
  <Fab
    color="secondary"
    component={Link}
    style={{
      position: "fixed",
      bottom: 16,
      right: 16,
      zIndex: 1000
    }}
    variant="extended"
    {...props}
  >
    {icon || null}
    {label || "Új"}
  </Fab>

export default ExtendedFAB