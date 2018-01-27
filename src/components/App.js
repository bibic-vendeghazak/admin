import React, {Component} from 'react'
import firebase from 'firebase/app'
import moment from 'moment'
import {initialAppState} from '../utils'

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
import Error from 'material-ui/svg-icons/alert/error'
import Warning from 'material-ui/svg-icons/alert/warning'



export default class App extends Component {
  
  state = initialAppState

  reset = () => this.setState(initialAppState)

  toggleSidebar = () => {
    this.setState(({isDrawerOpened}) => (
      {isDrawerOpened: !isDrawerOpened})
    )
  }

  loginAttempt = message => this.setState({isLoginAttempt: true, message})
  
  handleSnackbarClose = snackbarType => {
    this.setState({[snackbarType]: false})
    snackbarType === "gotServerMessage" && firebase.database().ref("serverMessage").set({
      message: "", type: "", newId: "", oldId: ""
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
          const {message: serverMessage, type} = snap.val()
          this.setState({
            serverMessage, type,
            gotServerMessage: true
          })
        })
        reservationsRef.on("value", snap => {
          const reservations = snap.val()
          let unreadReservationCount = 0
          const handledReservations = {}
          Object.keys(reservations).forEach(reservation => {
            const {metadata: {handled}} = reservations[reservation]
            if(!handled){
              unreadReservationCount+=1
            } else handledReservations[reservation] = reservations[reservation]
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
      gotServerMessage, serverMessage, type,
      appBarRightIcon: [appBarRightIconName, appBarRightIconText], appBarRightAction, message, isLoginAttempt
    } = this.state
    
    
    return (
      <div className="app">
        <Snackbar 
          autoHideDuration={4000} 
          open={isLoginAttempt}
          onRequestClose={() => this.handleSnackbarClose("isLoginAttempt")}
          {...{message}}
        />
        {serverMessage !== "" &&
          <Snackbar
          autoHideDuration={8000} 
          open={gotServerMessage}
          onRequestClose={() => this.handleSnackbarClose("gotServerMessage")}
          message={
            <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", margin: "0 6px"}}>
              {serverMessage} 
              {{
                error: <Error color="#f44242"/>,
                warning: <Warning color="#ce3737"/>
              }[type]}
            </div>
            }
          />
        }
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
              loginAttempt={this.loginAttempt}
              {...{profile, isMenuActive, isDrawerOpened,unreadReservationCount, unreadFeedbackCount}}
              reset={this.reset}
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
          <Login loginAttempt={this.loginAttempt}/>
        }
      </div>
    )
  }
}