import React from "react"
import ReactDOM from "react-dom"
import {BrowserRouter as Router} from "react-router-dom"
import {MuiThemeProvider as Material} from "@material-ui/core/styles"
import {Database} from "./db/Store"


import {theme} from "./utils"
import "./lib/firebase"
import App from "./components/App"

ReactDOM.render(
  <Material theme={theme}>
    <Database>
      <Router>
        <App/>
      </Router>
    </Database>
  </Material>,
  document.querySelector("#root")
)