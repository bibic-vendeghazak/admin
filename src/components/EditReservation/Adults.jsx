import React from 'react'
import {TextField, InputAdornment} from '@material-ui/core'

export const Adults = ({onChange, value}) =>
  <TextField
    InputProps={{endAdornment: <InputAdornment>fő</InputAdornment>}}
    fullWidth
    label="Felnőtt"
    min={1}
    name="adults"
    onChange={({target: {value}}) => onChange("adults", (parseInt(value, 10) || 1), true)}
    type="number"
    value={value || ""}
  />


export default Adults

