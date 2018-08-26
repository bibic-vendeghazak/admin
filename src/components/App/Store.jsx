import React, {Component} from "react"
import PropTypes from 'prop-types'
import moment from 'moment'
import {
  AUTH,
  ADMINS,
  ROOMS_DB,
  SERVER_MESSAGE_DB,
  ROOM_SERVICES_DB,
  RESERVATIONS_FS,
  FEEDBACKS_FS,
  GALLERIES_DB,
  RESERVATION_DATES_DB
} from "../../utils/firebase"
import {routes} from "../../utils"

const Store = React.createContext()


/*
 * REVIEW: Using withStore may cause flickering?
 */


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
          {values => (
            <Wrapped {...{
              ...values,
              ...this.props
            }}
            />
          )}
        </Store.Consumer>
      )
    }
  }


export class Database extends Component {

  static propTypes = {children: PropTypes.object.isRequired}

  state = {
    isLoggedIn: false,
    mobileOpen: false,
    profile: {
      name: null,
      src: null
    },
    snackbar: {
      open: false,
      message: {}
    },
    dialog: {
      open: false,
      title: "Biztos benne, hogy folytatni akarja?",
      content: "",
      cancelLabel: "Mégse",
      submitLabel: "Igen"
    },
    rooms: [],
    roomPictures: [],
    reservations: null,
    unHandledReservationCount: 0,
    unreadFeedbackCount: 0
  }


  componentDidMount() {
    AUTH.onAuthStateChanged(user => {
      if (user) {
        this.handleSendNotification({
          code: "success",
          message: "Sikeres bejelentkezés."
        })
        this.setState({isLoggedIn: true})
        RESERVATIONS_FS.where("handled", "==", false).onSnapshot(snap => {
          this.setState({unHandledReservationCount: snap.size})
        })
        RESERVATIONS_FS.onSnapshot(snap => {
          const reservations = []
          snap.forEach(reservation => {
            reservations.push({
              key: reservation.id,
              ...reservation.data()
            })
          })
          this.setState({reservations})
        })
        FEEDBACKS_DB.on("value", snap => {
          let unreadFeedbackCount = 0
          snap.forEach(feedback => {
            if (!feedback.val().handled) {
              unreadFeedbackCount+=1
            }
          })
          this.setState({unreadFeedbackCount})
        })
        ADMINS.child(user.uid).once("value", snap => {
          this.setState({profile: snap.val()})
        })
        SERVER_MESSAGE_DB.on("value", snap => {
          const {
            message, type
          } = snap.val()
          message !== "" && this.handleNotification(message, type, "server")
        })


        ROOMS_DB.on("value", snap => {
          const rooms = snap.val()
          RESERVATION_DATES_DB
            .child(moment().format("YYYY/MM/DD"))
            .once("value", snap => {
              snap.forEach(reservation => {
                if (snap.exists) {
                  Object.keys(snap.val()).map(key => key.substring(1))
                    .forEach(roomId => {
                      rooms[roomId-1]["isBooked"] = true
                      rooms.key = reservation.key
                    })
                }
              })
            }).then(() => this.setState({rooms}))
            .catch(this.handleSendNotification)
        })

        GALLERIES_DB.child(routes.ROOMS)
          .on("value", snap => this.setState({roomPictures: snap.exists() ? snap.val() : []}))

        ROOM_SERVICES_DB.on("value", snap => {
          this.setState({roomServices: snap.val()})
        })
        this.setState({isLoggedIn: true})
      } else this.handleSendNotification({
        code: "success",
        message: "Sikeres kijelentkezés."
      })
    })
  }


  handleSendNotification = ({
    code, message
  }) =>
    this.setState(state => ({
      ...state,
      snackbar: {
        ...state.snackbar,
        open: true,
        message: {
          code,
          message
        }
      }
    }))

  handleCloseNotification = () =>
    this.setState(state => ({
      ...state,
      snackbar: {
        ...state.snackbar,
        open: false
      }
    }))

    handleLogout = () => {
      AUTH.signOut().then(() => {
        this.setState({isLoggedIn: false})
      })
        .catch(this.handleSendNotification)
    }


  handleDrawerToggle = () =>
    this.setState(({mobileOpen}) => ({mobileOpen: !mobileOpen}))


  /**
   * @param {object} dialog The dialogs title, content, and button labels.
   * @param {Promise} submit The action to be called if the dialog is accepted.
   * @param {string} success After submitting, a notification is sent.
   * This, or the error message is the content.
   * @param {func} handleClose The function to be called when the dialog will
   * be closed
   * @return {null} .
   */
  handleOpenDialog = (dialog, submit, success, handleClose) =>
    this.setState(state => ({
      ...state,
      dialog: {
        ...state.dialog,
        ...dialog,
        open: true
      },
      acceptDialog: () => {
        submit()
          .then(() => {
            this.handleSendNotification({
              code: "success",
              message: success
            })
          })
          .then(() => handleClose ? handleClose() : this.handleCloseDialog())
          .catch(this.handleSendNotification)
        this.handleCloseDialog()
      }
    }))

  handleCloseDialog = () =>
    this.setState(state => ({
      ...state,
      dialog: {
        ...state.dialog,
        open: false
      }
    }))


  render() {
    return (
      <Store.Provider
        value={{
          sendNotification: this.handleSendNotification,
          closeNotification: this.handleCloseNotification,
          openDialog: this.handleOpenDialog,
          closeDialog: this.handleCloseDialog,
          handleLogout: this.handleLogout,
          handleDrawerToggle: this.handleDrawerToggle,
          ...this.state
        }}
      >
        {this.props.children}
      </Store.Provider>
    )
  }
}


export default Store