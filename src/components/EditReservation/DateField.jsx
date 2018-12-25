import React from 'react'
import {TextField} from "@material-ui/core"
import moment from "../../lib/moment"

export const DateField = ({from, to, type, onChange}) => {
  const onDateChange = ({target: {name, value}}) => {
    value = moment(value).startOf("day")
    let newFrom, newTo
    switch (name) {
    case "from":
      newFrom = value.clone().hours(14).toDate()
      break
    default:
      newTo = value.clone().hours(10).toDate()
    }
    onChange("from", newFrom || from, true)
    onChange("to", newTo || to, true)
  }

  return (
    <TextField
      fullWidth
      label={type === "from" ? "Érkezés" : "Távozás"}
      margin="normal"
      name={type}
      onChange={onDateChange}
      required
      type="date"
      value={moment(type === "from" ? from : to).format("YYYY-MM-DD")}
    />
  )
}
