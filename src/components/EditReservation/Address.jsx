import React from 'react'
import {TextField} from '@material-ui/core'

const Address = ({value, onChange}) =>
  <TextField
    autoComplete="address"
    fullWidth
    label="Lakcím"
    margin="normal"
    name="address"
    onChange={({target: {value}}) => onChange("address", value, false)}
    type="address"
    value={value}
  />

export default Address