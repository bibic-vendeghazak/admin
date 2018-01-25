import React, {Component} from 'react'
import firebase from 'firebase/app'

import {initialAppState, formatData} from '../utils'

import Welcome from './Welcome'
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
  
  changeAppBarRightIcon = (appBarRightIcon=[null,null]) => {
    this.setState({appBarRightIcon})
  }


  changeOpenedMenuItem = (openedMenuItem, appBarRightIcon) => {
    this.changeAppBarRightIcon(appBarRightIcon)
    this.setState({openedMenuItem})
  }

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        firebase.database().ref("/").on('value', snap => {
          const data = formatData(user, snap.val())
          this.setState({...data, isLoggedIn: true})
        })
      }
    })
  }

  render() {
    const {
      profile, unreadReservationCount, unreadFeedbackCount,
      isMenuActive, rooms,
      reservations, handledReservations,feedbacks,
      openedMenuItem, openedMenuTitle, roomsBooked,
      isDrawerOpened, isLoggedIn,
      appBarRightIcon: [appBarRightIconName, appBarRightIconText], appBarRightAction, message, isLoginAttempt
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
                appBarRightIconName &&
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: "#fff"
                  }}>
                  <p>{appBarRightIconText}</p>
                  <IconButton>
                    <FontIcon color="#fff" className="material-icons">{appBarRightIconName}</FontIcon>
                  </IconButton>
                </div>
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
                welcome: <Welcome {...{profile, appBarRightAction}}/>,
                rooms: 
                  <Rooms
                    changeAppBarRightIcon={this.changeAppBarRightIcon}
                    {...{roomsBooked, appBarRightAction}}
                  />,
                reservations: <Reservations {...{reservations, appBarRightAction}}/>,
                calendar: 
                  <Calendar 
                    changeAppBarRightIcon={this.changeAppBarRightIcon}
                    {...{appBarRightAction}}
                    reservations={handledReservations}
                  />,
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