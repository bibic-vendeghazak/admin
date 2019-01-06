import React from 'react'
import {withStyles, TextField, InputAdornment} from '@material-ui/core'
import {withStore} from '../../db'
import {colors} from '../../utils'
import SearchRounded from "@material-ui/icons/SearchRounded"
import Close from "@material-ui/icons/CloseRounded"
import {getQueryType} from '../../db/Store/search'

const Search = ({search, classes, ...props}) => {
  const queryType = getQueryType(props.match.path)
  const value = props[queryType] ? props[queryType].query.join(" ") : ""
  return (
    <TextField
      InputProps={{
        classes: {root: classes.root},
        endAdornment: <InputAdornment>{
          value ?
            <Close onClick={() => search(queryType, "")} style={{cursor: "pointer"}}/> :
            <SearchRounded/>
        }
        </InputAdornment>
      }}
      name="query"
      onChange={({target: {value}}) => search(queryType, value)}
      placeholder="Keresés"
      value={value}
    />
  )
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

