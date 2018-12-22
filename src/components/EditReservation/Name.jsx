import React from 'react'
import {TextField} from '@material-ui/core'

const Name = ({value, onChange}) =>
  <TextField
    autoComplete="name"
    fullWidth
    label="Név"
    margin="normal"
    name="name"
    onChange={({target: {value}}) => onChange("name", value, false)}
    type="name"
    value={value}
  />

export default Name