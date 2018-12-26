import {createMuiTheme} from "@material-ui/core/styles"
import colors from "./colors"

export default createMuiTheme({
  palette: {
    primary: {main: colors.lightBrown},
    secondary: {main: colors.orange}
  },
  typography: {useNextVariants: true}
})