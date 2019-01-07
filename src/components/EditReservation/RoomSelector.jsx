import React from 'react'
import {FormControl, InputLabel, Select, Input, MenuItem} from '@material-ui/core'

const RoomSelector = ({rooms, value: prevValue, onChange}) => {

  const handleChange = ({target: {value}}) => {
    if (Array.isArray(value[value.length-1])) {
      if (prevValue.length === rooms.length) {
        onChange("roomId", [1], true)
      } else {
        onChange("roomId", value[value.length-1], true)
      }
    } else {
      onChange("roomId", value, true)
    }
  }

  const all = rooms.length ? rooms.map(({id}) => id) : [1]

  return (
    <FormControl>
      <InputLabel htmlFor="roomId" required shrink>Szoba</InputLabel>
      <Select
        input={<Input name="roomId"/>}
        multiple
        name="roomId"
        onChange={handleChange}
        renderValue={selected => selected.join(", ")}
        required
        value={Array.isArray(prevValue) ? prevValue : [prevValue]}
      >
        <MenuItem value={all}>Összes szoba</MenuItem>
        {rooms.map(room =>
          <MenuItem key={room.id} value={room.id}>Szoba {room.id}</MenuItem>)
        }
      </Select>
    </FormControl>
  )
}

export default RoomSelector