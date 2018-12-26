import React from 'react'
import {TextField, InputAdornment, Tooltip} from '@material-ui/core'
import Autorenew from '@material-ui/icons/AutorenewRounded'
import Error from "@material-ui/icons/Error"


export const Price = ({value, onChange, error}) => {
  const pricingNeeded = error && error.code === "CUSTOM_PRICING_NEEDED"
  return (
    <TextField
      InputProps={{startAdornment: <InputAdornment position="start">HUF</InputAdornment>,
        endAdornment:
        <InputAdornment>
          {pricingNeeded ?
            value === 0 && <Error color="error"/> :
            <Tooltip title="Automatikus árazás">
              <Autorenew color="disabled"/>
            </Tooltip>
          }
        </InputAdornment>
      }}
      error={Boolean(error)}
      fullWidth
      label={(error && error.message) || "Ár"}
      margin="none"
      name="price"
      onChange={({target: {value}}) => onChange("price", parseInt(value, 10) || 0, false)}
      type="number"
      value={value || ""}
    />
  )
}

export default Price