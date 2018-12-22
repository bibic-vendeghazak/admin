import React, {Component} from "react"
import PropTypes from "prop-types"
import {
  AUTH,
  ADMINS,
  ROOMS_DB,
  ROOM_SERVICES_DB,
  RESERVATIONS_FS,
  FEEDBACKS_FS,
  GALLERIES_DB,
  RESERVATION_DATES_DB,
  MESSAGES_FS
} from "../../lib/firebase"
import {routes} from "../../utils"
import {TODAY} from "../../lib/moment"


const initialDialog = {
  open: false,
  title: "Biztos benne, hogy folytatni akarja?",
  content: "",
  cancelLabel: "Mégse",
  submitLabel: "Igen"
}

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
          {values => (
            <Wrapped {...{...values,
              ...this.props}}
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
    profile: {name: "Bíbic vendégházak",
      src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAAOUlEQVR42u3OIQEAAAACIP1/2hkWWEBzVgEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAYF3YDicAEE8VTiYAAAAAElFTkSuQmCC"},
    snackbar: {open: false,
      message: {}},
    dialog: initialDialog,
    rooms: [],
    roomPictures: [],
    unhandledReservationCount: 0,
    unhandledFeedbackCount: 0,
    unhandledMessageCount: 0
  }


  componentDidMount() {
    AUTH.onAuthStateChanged(user => {
      if (user) {
        ADMINS.child(user.uid).once("value", snap => {
          this.setState({profile: snap.val()})
        })
        this.handleSendNotification({code: "success",
          message: "Sikeres bejelentkezés."})

        // Fetch counts
        this.setState({isLoggedIn: true})
        RESERVATIONS_FS.where("handled", "==", false).onSnapshot(snap =>
          this.setState({unhandledReservationCount: snap.size})
        )

        FEEDBACKS_FS.where("accepted", "==", false).onSnapshot(snap =>
          this.setState({unhandledFeedbackCount: snap.size})
        )

        MESSAGES_FS.where("accepted", "==", false).onSnapshot(snap =>
          this.setState({unhandledMessageCount: snap.size})
        )


        ROOMS_DB.on("value", async snap => {
          const rooms = snap.val()
          try {
            const reservations = await RESERVATION_DATES_DB
              .child(TODAY.clone().format("YYYY/MM/DD"))
              .once("value", reservations => reservations)
            if (reservations.exists()) {
              reservations.forEach(() => {
                Object.keys(reservations.val())
                  .map(key => key.substring(1))
                  .forEach(roomId => {rooms[roomId-1].booked = true})
              })
            }
            this.setState({rooms})
          } catch (error) {
            this.handleSendNotification(error)
          }
        })

        GALLERIES_DB.child(routes.ROOMS)
          .on("value", snap => this.setState({roomPictures: snap.exists() ? snap.val() : []}))

        ROOM_SERVICES_DB.on("value", snap => {
          this.setState({roomServices: snap.val()})
        })
        this.setState({isLoggedIn: true})
      } else this.handleSendNotification({code: "success",
        message: "Kijelentkezve."})
    })
  }


  handleSendNotification = ({code, message}) =>
    this.setState(state => ({...state,
      snackbar: {
        ...state.snackbar,
        open: true,
        message: {code,
          message}
      }}))

  handleCloseNotification = () =>
    this.setState(state => ({...state,
      snackbar: {...state.snackbar, open: false}}))

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
      acceptDialog: async () => {
        try {
          await submit()
          await this.handleSendNotification({code: "success", message: success})
          handleClose ? handleClose() : this.handleCloseDialog()
        } catch (error) {
          this.handleSendNotification(error)
        } finally {
          this.handleCloseDialog()
        }
      }
    }))

  handleCloseDialog = () =>
    this.setState(state => ({...state, dialog: initialDialog}))


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