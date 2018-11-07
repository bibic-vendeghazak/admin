import React from 'react'
import {FormControl, InputLabel, Select, Input, MenuItem} from '@material-ui/core'


const FoodService = ({value, onChange}) =>
  <FormControl>
    <InputLabel htmlFor="service">Ellátás</InputLabel>
    <Select
      input={<Input id="service" name="foodService"/>}
      name="foodService"
      onChange={({target: {value}}) => onChange("foodService", value, true)}
      value={value}
    >
      <MenuItem value="breakfast">reggeli</MenuItem>
      <MenuItem value="halfBoard">félpanzió</MenuItem>
    </Select>
  </FormControl>

export default FoodService