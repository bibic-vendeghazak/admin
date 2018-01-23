import React, {Component} from 'react'
import firebase from 'firebase/app'

import {initialAppState, formatData} from '../utils'
import {Welcome} from './static'

import Login from './Auth/Login'
import Sidebar from './Sidebar'
import Rooms from './Rooms'
import Reservations from './Reservations'
import Calendar from './Calendar'
import Stats from './Stats'
import Feedbacks from './Feedbacks'
import Snackbar from 'material-ui/Snackbar'

import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'
import FontIcon from 'material-ui/FontIcon'

export default class App extends Component {
  
  state = initialAppState

  reset = () => this.setState(initialAppState)

  toggleSidebar = () => {
    this.setState(({isDrawerOpened}) => (
      {isDrawerOpened: !isDrawerOpened})
    )
  }

  loginAttempt = message => this.setState({isLoginAttempt: true, message})
  
  handleSnackbarClose = () => {this.setState({isLoginAttempt: false})}

  handleAppBarRightButtonClick = appBarRightAction => {
    this.setState({appBarRightAction})
  }
  
  changeOpenedMenuItem = (openedMenuItem, appBarRightIcon) => {
    this.setState({openedMenuItem, appBarRightIcon})
  }

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        firebase.database().ref("/").on('value', snap => {
          const data = formatData(user, snap.val())
          this.setState({...data, isLoggedIn: true})
          localStorage.setItem("data", JSON.stringify(data));
        })
      }
    })
  }

  render() {
    const {
      profile, unreadReservationCount, unreadFeedbackCount,
      isMenuActive, rooms, roomServices,
      reservations, handledReservations,feedbacks,
      openedMenuItem, openedMenuTitle,
      isDrawerOpened, isLoggedIn,
      appBarRightIcon, appBarRightAction, message, isLoginAttempt
    } = this.state

    return (
      <div className="app">
        <Snackbar 
          autoHideDuration={4000} 
          open={isLoginAttempt}
          onRequestClose={this.handleSnackbarClose}
          {...{message}}
        />
        {isLoggedIn ?
          <div>
            <AppBar
              onLeftIconButtonClick={() => this.toggleSidebar()}
              style={{position: "fixed"}}
              title={openedMenuTitle[openedMenuItem]}
              iconElementRight={
                <IconButton>
                  <FontIcon className="material-icons">{appBarRightIcon}</FontIcon>
                </IconButton>
              }
              onRightIconButtonClick={() => this.handleAppBarRightButtonClick(openedMenuItem)}
            />
            <Sidebar
              {...{profile, isMenuActive, unreadReservationCount, unreadFeedbackCount}}
              reset={this.reset}
              changeOpenedMenuItem={this.changeOpenedMenuItem}
              {...{isDrawerOpened}}
            />
            <main style={{
              marginLeft: isDrawerOpened && 256,
              transition: 'margin-left 450ms cubic-bezier(0.23, 1, 0.32, 1)'
            }}>
              {{
                welcome: <Welcome {...{profile}}/>,
                rooms: <Rooms {...{rooms, roomServices}}/>,
                reservations: <Reservations {...{reservations, appBarRightAction}}/>,
                calendar: <Calendar {...{appBarRightAction}} reservations={handledReservations}/>,
                stats: <Stats {...{rooms, feedbacks}} reservations={handledReservations}/>,
                feedbacks: <Feedbacks {...{feedbacks}}/>  
              }[openedMenuItem]}
            </main>      
          </div> :
          <Login loginAttempt={this.loginAttempt}/>
        }
      </div>
    )
  }
}