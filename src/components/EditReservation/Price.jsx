import React from 'react'
import {TextField, InputAdornment, Tooltip} from '@material-ui/core'
import Autorenew from '@material-ui/icons/AutorenewRounded'


const Price = ({value, onChange, error}) =>
  <TextField
    InputProps={{startAdornment: <InputAdornment position="start">HUF</InputAdornment>,
      endAdornment:
        <InputAdornment>
          <Tooltip title="Automatikus árazás">
            <Autorenew color="disabled"/>
          </Tooltip>
        </InputAdornment>}}
    error={Boolean(error)}
    fullWidth
    label={error || "Ár"}
    margin="none"
    name="price"
    onChange={({target: {value}}) => onChange("price", parseInt(value, 10) || 0, false)}
    type="number"
    value={value || ""}
  />

export default Price