import React, {Component} from "react"
import {Route, withRouter} from "react-router-dom"
import {Database} from "./Store"
import {AUTH} from "../../utils/firebase"

import AppBar from "material-ui/AppBar"
import IconButton from "material-ui/IconButton"
import FontIcon from "material-ui/FontIcon"

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
  	switch("/"+this.props.location.pathname.split("/")[1]) {
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
  	let {pathname} = this.props.location

  	iconName = "close"
  	iconText = "Bezárás"


  	return (
  		( pathname.includes("szerkeszt") ||
        (pathname.includes(routes.CALENDAR) && pathname.split("/").length === 5)
  		) ? 
  			<div
  				title={"Esc\n__________\nNyomd le ezt a billentyűt"}
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
  		profile,
  		isMenuActive,
  		isDrawerOpened, isLoggedIn,
  		// Snackbar states
  		notificationMessage, notificationType, isNotificationOpen, errorType,
  	} = this.state

    
  	return (
  		<Database>
  			<div className="app">
  				<Notification
  					handleNotificationClose={this.handleNotificationClose} 
  					{...{isLoggedIn, notificationMessage, notificationType, isNotificationOpen, errorType}}
  				/> 
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
  							{...{profile, isMenuActive, isDrawerOpened}}
  							toggleSidebar={this.toggleSidebar}
  						/>
  						<main style={{
  							marginLeft: isDrawerOpened && window.innerWidth >= 768 && 256,
  							transition: "margin-left 450ms cubic-bezier(0.23, 1, 0.32, 1)"
  						}}>
  							<Route
  								path={routes.WELCOME}
  								component={({match}) => <Welcome {...{match, profile}}/>}
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
  								path={routes.FOODS}
  								component={() => <GalleryCard baseURL={routes.FOODS} path="foods"/>}
  							/>
  							<Route
  								path={routes.EVENTS}
  								component={() => <GalleryCard baseURL={routes.EVENTS} path="events"/>}
  							/>
  							<Route
  								path={routes.INTRO}
  								component={() => <TextSection title="Bemutatkozás" path="history"/>}
  							/>
  							<Route
  								path={routes.CERTIFICATES}
  								component={() => <TextSection title="Tanúsítványok" path="napraforgo"/>}
  							/>
  							<Route
  								path={routes.RESERVATIONS+"/:handledState?"}
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
  		</Database>
  	)
  }
}

export default withRouter(App)


