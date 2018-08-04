import React, { Component } from "react"
import {
	AUTH,
	ADMINS,
	ROOMS_DB,
	SERVER_MESSAGE_DB,
	ROOM_SERVICES_DB,
	RESERVATIONS_FS,
	RESERVATION_DATES_DB,
	FEEDBACKS_DB
} from "../../utils/firebase"
import moment from "moment"


const Store = React.createContext()

export class Database extends Component {

  state = {
  	profile: {
  		name: null,
  		src: null
  	},
  	rooms: [],
  	unHandledReservationCount: 0,
  	unreadFeedbackCount: 0
  }

  componentDidMount() {
  	AUTH.onAuthStateChanged(user => {
  		if (user) {
  			RESERVATIONS_FS.where("handled", "==", false).onSnapshot(snap => {
  				this.setState({unHandledReservationCount: snap.size})
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
  			ADMINS.child(user.uid).once("value", snap =>{
  				this.setState({profile: snap.val()})
  			})
  			SERVER_MESSAGE_DB.on("value", snap => {
  				const {message, type} = snap.val()
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
  									})
  							}
  						})
  					}).then(() => this.setState({rooms}))
  					.catch(e => {throw new Error(e)})
  			})

  			ROOM_SERVICES_DB.on("value", snap => {
  				this.setState({
  					roomServices: snap.val()
  				})
  			})
  			this.setState({isLoggedIn: true})
  		}
  	})
  }

  render() {
  	return (
  		<Store.Provider value={{...this.state}}>
  			{this.props.children}
  		</Store.Provider>
  	)
  }
}


export default Store