import React, {Component} from 'react'
import {withStyles, TextField, InputAdornment} from '@material-ui/core'
import {withStore} from '../../db'
import {routes, colors} from '../../utils'
import SearchRounded from "@material-ui/icons/SearchRounded"

class Search extends Component {
  state = {
    queryType: ""
  }

  componentDidMount() {
    const queryType = this.props.match.path
      .includes(routes.RESERVATIONS) ? "reservationQuery" : "messageQuery"
    this.setState({queryType})
  }

  componentDidUpdate({match: {path: prevPath}}) {
    const {match: {path}} = this.props
    if (prevPath !== path) {
      const queryType = path.includes(routes.RESERVATIONS) ? "reservationQuery" : "messageQuery"
      this.props.search(queryType, "")
      this.setState({queryType})
    }
  }


  componentWillUnmount() {
    this.props.search(this.state.queryType, "")
  }

  render() {
    const {queryType} = this.state
    const {reservationQuery, messageQuery, search, classes} = this.props
    const value = (queryType === "reservationQuery" ? reservationQuery : messageQuery).join(" ")

    return(
      <TextField
        InputProps={{
          classes: {root: classes.root},
          endAdornment: <InputAdornment><SearchRounded/></InputAdornment>
        }}
        name="query"
        onChange={({target: {value}}) => search(queryType, value)}
        placeholder="Keresés"
        value={value}
      />
    )
  }
}

export default withStore(withStyles(theme => ({
  root: {
    color: "white",
    backgroundColor: colors.darkBrown,
    padding: `${theme.spacing.unit/2}px ${theme.spacing.unit}px`,
    borderRadius: theme.spacing.unit/2,
    marginRight: -theme.spacing.unit*1.5,
    width: 390,
    maxWidth: "80vw"
  }
}))(Search))

