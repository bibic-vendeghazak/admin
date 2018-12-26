import React, {Component} from 'react'
import {Grid, TextField, InputAdornment} from '@material-ui/core'


class Children extends Component {
  state = {
    defaultValues: [
      {name: "0-6", count: 0},
      {name: "6-12", count: 0}
    ]
  }

  handleChildren = ({target: {value, name}}) => {
    const {values} = this.props
    const children = [...(values.length ? values : this.state.defaultValues)]
    value = parseInt(value, 10) || 0
    children[children.findIndex(({name: n}) => n === name)].count = value < 0 ? 0 : value
    this.props.onChange("children", children, true)
  }

  render() {
    const {defaultValues} = this.state
    const {values} = this.props
    return (
      (values.length ? values : defaultValues).map(({name, count}, i) =>
        <Grid item key={name} style={{paddingLeft: (i % 2) * 16}} xs={6}>
          <TextField
            InputProps={{endAdornment: <InputAdornment>fő</InputAdornment>}}
            fullWidth
            id="children"
            label={`${name} éves`}
            min={0}
            name={name}
            onChange={this.handleChildren}
            type="number"
            value={count || ""}
          />
        </Grid>
      )
    )
  }
}

export default Children