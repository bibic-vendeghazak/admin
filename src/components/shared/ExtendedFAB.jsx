
import React from "react"
import {Link} from 'react-router-dom'

import {Button} from '@material-ui/core'

const ExtendedFAB = ({
  icon, label, ...props
}) =>
  <Button
    color="secondary"
    component={Link}
    style={{
      position: "fixed",
      bottom: 16,
      right: 16,
      zIndex: 1000
    }}
    variant="extendedFab"
    {...props}
  >
    {icon || null}
    {label || "Új"}
  </Button>

export default ExtendedFAB