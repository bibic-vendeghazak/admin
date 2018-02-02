import React, {Component} from 'react'
import firebase from 'firebase/app'
import moment from 'moment'

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

const initialAppState = {
  isDrawerOpened: true,
  isLoggedIn: false,

  // Notification state
  isNotificationOpen: false,
  notificationMessage: "",
  notificationType: "",
  errorType: "",

  rooms: {},
  calendar: {},
  stats: {},
  feedbacks: {},
  reservations: {},
  roomServices: {},
  unreadReservationCount: 0,
  unreadFeedbackCount: 0,
  openedMenuItem: "reservations",
  appBarRightIcon: [null, null],
  openedMenuTitle: {
    welcome: "Kezdőlap",
    rooms: "Szobák",
    reservations: "Foglalások",
    calendar: "Dátumok",
    stats: "Statisztikák",
    feedbacks: "Visszajelzések",
    settings: "Beállítások"
  },
  roomsBooked: {}
}


export default class App extends Component {
  
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
    window.innerWidth <=768 && this.setState({isDrawerOpened: false})
    const db = firebase.database()
    const reservationsRef = db.ref("reservations")
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
        reservationsRef.on("value", snap => {
          const reservations = snap.val()
          let unreadReservationCount = 0
          const handledReservations = {}
          reservations && Object.keys(reservations).forEach(reservation => {
            const {metadata: {handled, roomId, from, to}} = reservations[reservation]
            
            if(!handled){
              unreadReservationCount+=1
            } else {
              handledReservations[reservation] = reservations[reservation]        
              if (
                moment.range(moment(from), moment(to))
                .overlaps(
                  moment.range(moment().startOf("day"), moment().endOf("day"))
              )) {
                this.setState({roomsBooked: {
                  ...this.state.roomsBooked,
                  [roomId-1]: true
                }})
              }
            }
          })
          this.setState({reservations, handledReservations, unreadReservationCount})
        })
        feedbacksRef.on("value", snap => {
          const feedbacks = snap.val()
          let unreadFeedbackCount = 0
          Object.values(feedbacks).forEach(({handled}) => {
            if(!handled){
              unreadFeedbackCount+=1
            } 
          })
          this.setState({
            feedbacks, unreadFeedbackCount
          })
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

  render() {
    const {
      profile, unreadReservationCount, unreadFeedbackCount,
      isMenuActive, rooms,
      reservations, handledReservations,feedbacks,
      openedMenuItem, openedMenuTitle, roomsBooked,
      isDrawerOpened, isLoggedIn,
      // Snackbar states
      notificationMessage, notificationType, isNotificationOpen, errorType,
      // Appbar states
      appBarRightIcon: [appBarRightIconName, appBarRightIconText], appBarRightAction
    } = this.state
    
    return (
      <div className="app">
        <Notification handleNotificationClose={this.handleNotificationClose} {...{isLoggedIn, notificationMessage, notificationType, isNotificationOpen, errorType}}/> 
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
              handleLogout={this.handleLogout}
              {...{profile, isMenuActive, isDrawerOpened,unreadReservationCount, unreadFeedbackCount}}
              toggleSidebar={this.toggleSidebar}
              changeOpenedMenuItem={this.changeOpenedMenuItem}
            />
            <main style={{
              marginLeft: isDrawerOpened && window.innerWidth >= 768 && 256,
              transition: 'margin-left 450ms cubic-bezier(0.23, 1, 0.32, 1)'
            }}>
              {{
                welcome: <Welcome {...{profile, appBarRightAction}}/>,
                rooms: 
                  <Rooms
                    changeAppBarRightIcon={this.changeAppBarRightIcon}
                    {...{roomsBooked, appBarRightAction}}
                  />,
                reservations: <Reservations {...{unreadReservationCount, reservations, appBarRightAction}}/>,
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
          <Login handleNotification={this.handleNotification}/>
        }
      </div>
    )
  }
}