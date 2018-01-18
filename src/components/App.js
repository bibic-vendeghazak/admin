import React, { Component } from 'react'
import '../admin.css'
import firebase from 'firebase/app'
import Login from './Auth/Login'
import Menu from './Menu'
import Rooms from './Rooms'
import Reservations from './Reservations'
import Calendar from './Calendar'
import Stats from './Stats'
import Feedbacks from './Feedbacks'

const initialState = {
  isLoggedIn: false,
  rooms: {},
  calendar: {},
  stats: {},
  feedbacks: {},
  reservations: {},
  roomServices: {},
  unreadReservationCount: 0,
  unreadFeedbackCount: 0,
  openedMenuItem: "calendar"
}

const Welcome = () => (
  <h2 style={{
    marginTop: "30%"
  }}>Köszöntjük az admin kezelőfelületen!</h2>
)

const Footer = () => {

  return (
    <footer>
      <a
        href="https://balazsorban44.github.io/bibic-vendeghazak"
        target="_blank"
        rel="noopener noreferrer"
      >Bíbic vendégházak</a>
      <a
        href="https://balazsorban.com"
        target="_blank"
        rel="noopener noreferrer"
      >Orbán Balázs</a>
      <a href="mailto:info@balazsorban.com">info@balazsorban.com</a>
    </footer>
)}

export default class App extends Component {
  constructor() {
    super()
    this.state = initialState
  }

  reset() {
    this.setState(initialState)
    localStorage.removeItem("data")
  }

  toggleSidebar() {
    this.setState(prevState => (
      {isMenuActive: !prevState.isMenuActive})
    )
  }

  changeOpenedMenuItem(openedMenuItem) {
    this.setState({openedMenuItem})
  } 

  fetchPosts(posts){
    let unreadPostCount = 0
    let merged = {}
    const {metadata, details} = posts
    for (let post in metadata) {
      !metadata[post].handled && unreadPostCount++
      merged[post] = {
        metadata: metadata[post],
        details: details[post]
      }
    }
    return [merged, unreadPostCount]
  }

  componentDidMount() {
    firebase.auth()
      .onAuthStateChanged(user => {
        if (user) {
          firebase.database().ref("/").on('value', snap => {
            const v = snap.val()
            const {admins, rooms, roomServices} = v
            const [reservations, unreadReservationCount] = this.fetchPosts(v.reservations)
            const [feedbacks, unreadFeedbackCount] = this.fetchPosts(v.feedbacks)
            const {name, src} = admins[user.uid]
            const data = {
              profile: {name, src},
              rooms,
              roomServices,
              reservations,
              unreadReservationCount,
              feedbacks,
              unreadFeedbackCount
            }
            this.setState(data)
            localStorage.setItem("data", JSON.stringify(data));
          })
        }
    })
  }

  render() {
    let {
      profile, unreadReservationCount, unreadFeedbackCount,
      isMenuActive, rooms, roomServices,
      reservations, feedbacks, name,
      openedMenuItem
    } = this.state
    const isLoggedIn = profile !== undefined
    const handledReservations = {}
  	Object.entries(reservations)
  		    .forEach(reservation => {
            const {handled} = reservation[1].metadata
            if (handled) {
              handledReservations[reservation[0]] = reservation[1]
            }
          })
    return (
        <div className="app">
          <Menu
            {...{profile, isMenuActive, unreadReservationCount, unreadFeedbackCount}}
            reset={() => this.reset()}
            changeOpenedMenuItem={(openedMenuItem) => this.changeOpenedMenuItem(openedMenuItem)}
            toggleSidebar={() => this.toggleSidebar()}
          />
          {isLoggedIn &&
            <main>
              {{
                welcome: (
                  <Welcome {...{profile}}/>
                ),
                rooms: (
                  <Rooms {...{rooms, roomServices}}/>
                ),
                reservations: (
                  <Reservations {...{reservations}}/>
                ),
                calendar: (
                  <Calendar reservations={handledReservations}/>
                ),
                stats: (
                  <Stats {...{rooms, feedbacks}} reservations={handledReservations}/>
                ),
                feedbacks: (
                  <Feedbacks {...{feedbacks}}/>
                )
              }[openedMenuItem]}
            </main>}

          {!isLoggedIn && <Login name={name}/>}
          <Footer/>
        </div>
    )
  }
}
