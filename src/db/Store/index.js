import React, {Component} from "react"
import PropTypes from "prop-types"
import {AUTH} from "../../lib/firebase"
import {sendNotification, closeNotification, notification} from "./notification"
import {
  reservation, fetchReservation, updateReservation, fetchReservationCount
} from "./reservations"
import {openDialog, closeDialog, dialog} from "./dialog"
import {subscribeToRooms, subscribeToRoomServices} from "./rooms"
import {logout, getAdmin, profile} from "./auth"
import {fetchFeedbackCount} from "./feedbacks"
import {fetchMessageCount} from "./messages"
import {subscribeToGalleries} from "./gallery"
import * as search from "./search"
import {toggleDrawer} from "./drawer"


const Store = React.createContext()

/**
 * Makes the Store values available
 * @param {Component} Wrapped The component to pass the store values to
 * @returns {Component} Component with the Store values
 */
export const withStore = Wrapped =>
  class extends Component {
    render() {
      return (
        <Store.Consumer>
          {values => <Wrapped {...{...values, ...this.props}}/>}
        </Store.Consumer>
      )
    }
  }


export class Database extends Component {

  static propTypes = {children: PropTypes.object.isRequired}

  state = {
    isLoggedIn: false,
    mobileOpen: false,
    profile,
    notification,
    dialog,
    rooms: [],
    roomPictures: [],
    unhandledReservationCount: 0,
    unhandledFeedbackCount: 0,
    unhandledMessageCount: 0,
    reservation,
    queryType: "reservationsFilters",
    messagesFilters: {query: [""]},
    feedbacksFilters: {query: [""], filteredRooms: []},
    reservationsFilters: reservation.reservationsFilters
  }

  async componentDidMount() {
    try {
      AUTH.onAuthStateChanged(async user => {
        if (user) {

          // Counts
          this.fetchReservationCount()
          this.fetchFeedbackCount()
          this.fetchMessageCount()

          // Subscribe to data sources
          this.subscribeToRooms()
          this.subscribeToGalleries()
          this.subscribeToRoomServices()


          const profile = await getAdmin(user.uid)

          this.setState({profile, isLoggedIn: true}, () => {
            this.sendNotification({code: "success", message: "Sikeres bejelentkezés."})
          })


        } else {
          this.sendNotification({code: "success", message: "Kijelentkezve."})
        }
      })
    } catch (error) {
      this.sendNotification(error)
    }
  }


  // Notifications
  sendNotification = sendNotification.bind(this)

  closeNotification = closeNotification.bind(this)


  // Dialogs
  openDialog = openDialog.bind(this)

  closeDialog = closeDialog.bind(this)


  // Reservations
  fetchReservation = fetchReservation.bind(this)
  changeReservationsFilter = reservation.changeFilter.bind(this)

  fetchReservationCount = fetchReservationCount.bind(this)

  updateReservation = updateReservation.bind(this)


  // Rooms
  subscribeToRooms = subscribeToRooms.bind(this)

  subscribeToRoomServices = subscribeToRoomServices.bind(this)


  // Feedbacks
  fetchFeedbackCount = fetchFeedbackCount.bind(this)


  // Messages
  fetchMessageCount = fetchMessageCount.bind(this)


  // Galleries
  subscribeToGalleries = subscribeToGalleries.bind(this)


  // Auth
  logout = logout.bind(this)


  // Drawer
  toggleDrawer = toggleDrawer.bind(this)


  // Search
  search = search.search.bind(this)

  changeRoom = search.changeRoom.bind(this)

  render() {
    return (
      <Store.Provider
        value={{
          sendNotification: this.sendNotification,
          closeNotification: this.closeNotification,
          openDialog: this.openDialog,
          closeDialog: this.closeDialog,
          handleLogout: this.logout,
          handleDrawerToggle: this.toggleDrawer,
          updateReservation: this.updateReservation,
          fetchReservation: this.fetchReservation,
          changeReservationsFilter: this.changeReservationsFilter,
          changeRoom: this.changeRoom,
          search: this.search,
          ...this.state
        }}
      >
        {this.props.children}
      </Store.Provider>
    )
  }
}

export default Store