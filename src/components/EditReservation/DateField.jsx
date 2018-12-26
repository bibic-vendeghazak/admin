import React from 'react'
import {TextField} from "@material-ui/core"
import moment from "../../lib/moment"

export const DateField = ({from, to, type, onChange}) => {
  const onDateChange = ({target: {value}}) => {
    value = moment(new Date(value))
    let newFrom, newTo
    switch (type) {
    case "from":
      newFrom = value.clone().toDate()
      break
    default:
      newTo = value.clone().toDate()
    }
    onChange("from", moment(newFrom || from).startOf("day").hours(14).toDate(), true)
    onChange("to", moment(newTo || to).startOf("day").hours(10).toDate(), true)
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
