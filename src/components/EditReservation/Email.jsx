import React from 'react'
import { TextField } from '@material-ui/core';

const Email = ({value, onChange}) =>
  <TextField
    autoComplete="email"
    fullWidth
    label="E-mail cím"
    margin="normal"
    name="email"
    onChange={({target: {value}}) => onChange("email", value, false)}
    type="email"
    value={value}
  />

export default Email