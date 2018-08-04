import React from "react"
import ReactDOM from "react-dom"
import {BrowserRouter as Router} from "react-router-dom"
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
import getMuiTheme from "material-ui/styles/getMuiTheme"

import {muiTheme} from "./utils"
import "./utils/moment"
import "./utils/firebase"
import "./styles/main.css"
import App from "./components/App"

ReactDOM.render(
	<MuiThemeProvider 
		muiTheme={getMuiTheme(muiTheme)}
		children={
			<Router>
				<App/>
			</Router>
		}
	/>,
	document.querySelector("#root")
)
