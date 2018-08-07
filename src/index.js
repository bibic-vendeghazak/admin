import React from "react"
import ReactDOM from "react-dom"
import {BrowserRouter as Router} from "react-router-dom"

import {MuiThemeProvider as Material2} from '@material-ui/core/styles'
import {MuiThemeProvider} from "material-ui/styles"


import {muiTheme, mui2Theme} from "./utils"
import "./utils/moment"
import "./utils/firebase"
import "./styles/main.css"
import App from "./components/App"

ReactDOM.render(
  <Material2 theme={mui2Theme}>
    <MuiThemeProvider
      children={
        <Router>
          <App/>
        </Router>
      }
      muiTheme={muiTheme}
    />
  </Material2>,
  document.querySelector("#root")
)
