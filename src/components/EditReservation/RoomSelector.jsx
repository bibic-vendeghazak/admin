import React from 'react'
import {FormControl, InputLabel, Select, Input, MenuItem} from '@material-ui/core'

const RoomSelector = ({rooms, value, onChange}) =>
  <FormControl>
    <InputLabel htmlFor="roomId" required shrink>Szoba</InputLabel>
    <Select
      input={<Input name="roomId"/>}
      name="roomId"
      onChange={({target: {value}}) => onChange("roomId", value, true)}
      required
      value={value || 1}
    >
      <MenuItem value={1}>Szoba 1</MenuItem>
      {rooms.map(room => <MenuItem key={room.id} value={room.id}>Szoba {room.id}</MenuItem>)}
    </Select>
  </FormControl>

export default RoomSelector