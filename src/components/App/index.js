import React, {Component} from "react"
import {Route, withRouter} from "react-router-dom"
import {Database} from "./Store"
import {AUTH} from "../../utils/firebase"

import {
  AppBar,
  IconButton,
  FontIcon
} from "material-ui"

import Sidebar from "./Sidebar"
import Login from "./Auth/Login"

import Welcome from "../scenes/Welcome"
import Rooms from "../scenes/Rooms"
import Reservations from "../scenes/Reservations"
import Calendar from "../scenes/Calendar"
import Feedbacks from "../scenes/Feedbacks"
import Notification from "../shared/Notification"

import * as routes from "../../utils/routes"
import TextSection from "../shared/TextSection"
import GalleryCard from "../shared/GalleryCard"

const initialAppState = {
  isDrawerOpened: true,
  isLoggedIn: false,
  title:"",
  // Notification state
  isNotificationOpen: false,
  notificationMessage: "",
  notificationType: "",
  errorType: ""
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
    AUTH.signOut().then(() => {
      this.handleNotification("Sikeres kijelentkezés", "success")
      this.setState({isLoggedIn: false})
    })
  }


  componentDidMount = () => {
    window.innerWidth <=768 && this.setState({isDrawerOpened: false})
    AUTH.onAuthStateChanged(user => {
      if(user){
        this.setState({isLoggedIn: true})
      }
    })
  }

  renderTitle = () => {
    switch(`/${this.props.location.pathname.split("/")[1]}`) {
    case routes.ROOMS:
      return "Szobák"
    case routes.INTRO:
      return "Bemutatkozás"
    case routes.CERTIFICATES:
      return "Tanúsítványok"
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
    const {pathname} = this.props.location

    iconName = "close"
    iconText = "Bezárás"


    return (
      ( pathname.includes("szerkeszt") ||
        (pathname.includes(routes.CALENDAR) && pathname.split("/").length === 5)
      ) ?
        <div
          onClick={this.props.history.goBack}
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            color: "#fff"
          }}
          title={"Esc\n__________\nNyomd le ezt a billentyűt"}
        >
          <p>{iconText}</p>
          <IconButton>
            <FontIcon
              className="material-icons"
              color="#fff"
            >
              {iconName}
            </FontIcon>
          </IconButton>
        </div> : null
    )
  }


  render() {
    const {
      profile,
      isMenuActive,
      isDrawerOpened, isLoggedIn,
      // Snackbar states
      notificationMessage, notificationType, isNotificationOpen, errorType
    } = this.state


    return (
      <Database>
        <div className="app">
          <Notification
            handleNotificationClose={this.handleNotificationClose}
            {...{
              isLoggedIn,
              notificationMessage,
              notificationType,
              isNotificationOpen,
              errorType
            }}
          />
          {isLoggedIn ?
            <div>
              <AppBar
                iconElementRight={this.renderRightIcon()}
                onLeftIconButtonClick={() => this.toggleSidebar()}
                style={{position: "fixed"}}
                title={this.renderTitle()}
              />
              <Sidebar
                handleLogout={this.handleLogout}
                {...{
                  profile,
                  isMenuActive,
                  isDrawerOpened
                }}
                toggleSidebar={this.toggleSidebar}
              />
              <main style={{
                marginLeft: isDrawerOpened && window.innerWidth >= 768 && 256,
                transition: "margin-left 450ms cubic-bezier(0.23, 1, 0.32, 1)"
              }}
              >
                <Route
                  component={({match}) => <Welcome {...{
                    match,
                    profile
                  }}
                                          />
                  }
                  path={routes.WELCOME}
                />
                <Route
                  component={Calendar}
                  path={`${routes.CALENDAR}/:year/:month`}
                />
                <Route
                  component={Feedbacks}
                  path={routes.FEEDBACKS}
                />
                <Route
                  component={Rooms}
                  path={routes.ROOMS}
                />
                <Route
                  component={() =>
                    <GalleryCard
                      baseURL={routes.FOODS}
                      path="foods"
                    />
                  }
                  path={routes.FOODS}
                />
                <Route
                  component={() =>
                    <GalleryCard
                      baseURL={routes.EVENTS}
                      path="events"
                    />
                  }
                  path={routes.EVENTS}
                />
                <Route
                  component={() =>
                    <TextSection
                      path="history"
                    />
                  }
                  path={routes.INTRO}
                />
                <Route
                  component={() =>
                    <TextSection
                      path="napraforgo"
                    />
                  }
                  path={routes.CERTIFICATES}
                />
                <Route
                  component={Reservations}
                  path={`${routes.RESERVATIONS}/:handledState?`}
                />
                <Route
                  component={Feedbacks}
                  path={`${routes.FEEDBACKS}/:readState`}
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
      </Database>
    )
  }
}

export default withRouter(App)


