import React from 'react'
import {TextField} from '@material-ui/core'


const Message = ({value, onChange}) =>
  <TextField
    fullWidth
    label="Megjegyzés"
    margin="normal"
    multiline
    name="message"
    onChange={({target: {value}}) => onChange("message", value, false)}
    rows={2}
    value={value}
  />

export default Message