import React from 'react'
import {Switch, FormControlLabel} from '@material-ui/core'

export const ComplexitySwitch = ({checked, onChange}) =>
  <FormControlLabel
    control={
      <Switch
        checked={checked}
        onChange={onChange}
        value="complexity-change"
      />
    }
    label={checked ? "Részletes" : "Egyszerű"}
  />