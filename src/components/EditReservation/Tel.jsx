import React from 'react'
import {TextField} from '@material-ui/core'

const Tel = ({value, onChange}) =>
  <TextField
    autoComplete="tel"
    fullWidth
    label="Telefonszám"
    margin="normal"
    name="tel"
    onChange={({target: {value}}) => onChange("tel", value, false)}
    type="tel"
    value={value}
  />

export default Tel