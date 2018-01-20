import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import firebase from 'firebase/app'
import {colors} from './utils'
import './main.css'

const {orange, lightBrown, darkBrown} = colors

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: darkBrown,
    primary2Color: lightBrown,
    accent1Color: orange
  },
  badge: {
    primaryColor: orange
  },
  // raisedButton: {
  //   secondaryColor: orange
  // },
  drawer: {
    color: lightBrown
  }
});



firebase.initializeApp({
  apiKey: "AIzaSyB4-Y2_RCdrOouJJxUJkBBXGyj4hNdjDs0",
  authDomain: "bibic-vendeghazak-api.firebaseapp.com",
  databaseURL: "https://bibic-vendeghazak-api.firebaseio.com",
  projectId: "bibic-vendeghazak-api",
  storageBucket: "bibic-vendeghazak-api.appspot.com",
  messagingSenderId: "586582307718"
})

ReactDOM.render(
  <MuiThemeProvider muiTheme={muiTheme}>
    <App/>
  </MuiThemeProvider>
, document.getElementById('root'))
