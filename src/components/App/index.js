import React, {Component} from 'react'
import {Route, withRouter, Link} from 'react-router-dom'
import firebase from 'firebase/app'


import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'
import FontIcon from 'material-ui/FontIcon'

import Sidebar from './Sidebar'
import Login from './Auth/Login'

import Welcome from '../scenes/Welcome'
import Rooms from '../scenes/Rooms'
import Reservations from '../scenes/Reservations'
import Calendar from '../scenes/Calendar'
import Stats from '../scenes/Stats'
import Feedbacks from '../scenes/Feedbacks'
import Notification from '../shared/Notification'
import * as routes from '../../utils/routes';

const initialAppState = {
  isDrawerOpened: true,
  isLoggedIn: false,
  title:"",
  // Notification state
  isNotificationOpen: false,
  notificationMessage: "",
  notificationType: "",
  errorType: "",
  unHandledReservationCount: 0
}


class App extends Component {
  
  state = initialAppState

  toggleSidebar = () => {
    this.setState(({isDrawerOpened}) => (
      {isDrawerOpened: !isDrawerOpened})
    )
  }

  handleNotification = (notificationMessage, notificationType, errorType) => {
    
    this.setState({
      isNotificationOpen: true,
      notificationType,
      notificationMessage,
      errorType
    })
  }

  handleNotificationClose = () => this.setState({isNotificationOpen: false})

  handleLogout = () => {
    firebase.auth().signOut().then(() => {
      this.handleNotification("Sikeres kijelentkezés", "success")
      this.setState({isLoggedIn: false})
    })
  }
  

  componentDidMount = () => {
    window.innerWidth <=768 && this.setState({isDrawerOpened: false})
    const db = firebase.database()
    const reservations = db.ref("reservations")
    const feedbacksRef = db.ref("feedbacks")
    const roomsRef = db.ref("rooms")
    const roomServicesRef = db.ref("roomServices")
    const serverMessageRef = db.ref("serverMessage")
    firebase.auth().onAuthStateChanged(user => {
      if(user){
        db.ref(`admins/${user.uid}`).once("value", snap =>{
          this.setState({profile: snap.val()})
        })
        serverMessageRef.on("value", snap => {
          const {message, type} = snap.val()
          message !== "" && this.handleNotification(message, type, "server")
        })
        reservations.on("value", snap => {
          let unHandledReservationCount = 0
          snap.forEach(reservation => {
              if (!reservation.val().handled) {
                unHandledReservationCount++
              }
            })
          this.setState({unHandledReservationCount})
        })
        feedbacksRef.on("value", snap => {
          let unreadFeedbackCount = 0
          snap.forEach(feedback => {
            if (!feedback.val().handled) {
              unreadFeedbackCount+=1
            }
          })
          this.setState({unreadFeedbackCount})
        })

        roomsRef.on("value", snap => {
          this.setState({
            rooms: snap.val()
          })
        })
        roomServicesRef.on("value", snap => {
          this.setState({
            roomServices: snap.val()
          })
        })
        this.setState({isLoggedIn: true})
      } 
    })
  }

  renderTitle = () => {
    switch("/"+this.props.location.pathname.split("/")[1]) {
      case routes.ROOMS:
        return "Szobák"
      case routes.SPECIAL_OFFER:
        return "Akciós ajánlatok"
      case routes.CALENDAR:
        return "Naptár"
      case routes.RESERVATIONS:
        return "Foglalások"
      case routes.FEEDBACKS:
        return "Visszajelzések"
      case routes.FOODS:
        return "Ételek"
      case routes.STATS:
        return "Statisztikák"
      default:
        return "Admin kezelőfelület"
    }
  }

  renderRightIcon = () => {
    let iconName, iconText= ""
    let {pathname} = this.props.location

    iconName = "close"
    iconText = "Bezárás"


    return (
      ( pathname.includes("szerkeszt") ||
        (pathname.includes(routes.CALENDAR) && pathname.split("/").length === 5)
      ) ? 
      <div
        title={`Esc\n__________\nNyomd le ezt a billentyűt`}
        onClick={this.props.history.goBack}
        style={{
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          color: "#fff"
        }}>
        <p>{iconText}</p>
          <IconButton>
            <FontIcon 
              color="#fff" 
              className="material-icons">
              {iconName}
            </FontIcon>
          </IconButton>
      </div> : null
    )
  }


  render() {
    const {
      profile, unHandledReservationCount, unreadFeedbackCount,
      isMenuActive,
      isDrawerOpened, isLoggedIn,
      // Snackbar states
      notificationMessage, notificationType, isNotificationOpen, errorType,
    } = this.state
    return (
      <div className="app">
        <Notification handleNotificationClose={this.handleNotificationClose} {...{isLoggedIn, notificationMessage, notificationType, isNotificationOpen, errorType}}/> 
        {isLoggedIn ?
          <div>
            <AppBar
              onLeftIconButtonClick={() => this.toggleSidebar()}
              style={{position: "fixed"}}
              title={this.renderTitle()}
              iconElementRight={this.renderRightIcon()}
            />
            <Sidebar
              handleLogout={this.handleLogout}
              {...{profile, isMenuActive, isDrawerOpened,unHandledReservationCount, unreadFeedbackCount}}
              toggleSidebar={this.toggleSidebar}
            />
            <main style={{
              marginLeft: isDrawerOpened && window.innerWidth >= 768 && 256,
              transition: 'margin-left 450ms cubic-bezier(0.23, 1, 0.32, 1)'
            }}>
                <Route
                  path={routes.WELCOME}
                  component={({match}) =>
                    <Welcome {...{match, profile}}/>
                  }
                />
                <Route
                  path={routes.CALENDAR+"/:year/:month"}
                  component={Calendar}
                />
                <Route
                  path={routes.ROOMS}
                  component={Rooms}
                />
                <Route
                  path={routes.RESERVATIONS+"/:readState"}
                  component={Reservations}
                />
                <Route
                  path={routes.FEEDBACKS+"/:readState"}
                  component={Feedbacks}
                />
                {/* <Route
                  path={routes.STATS}
                  component={({match}) =>
                    <Stats
                      {...{match, rooms, feedbacks}}
                      reservations={handledReservations}
                    />
                  }
                /> */}
            </main>      
          </div> :
          <Login handleNotification={this.handleNotification}/>
        }
      </div>
    )
  }
}


export default withRouter(App)