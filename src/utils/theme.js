import {createMuiTheme} from '@material-ui/core/styles'
import {colors} from './colors'

const theme = createMuiTheme({palette: {
  primary: {main: colors.lightBrown},
  secondary: {main: colors.orange}
}})

export {theme}