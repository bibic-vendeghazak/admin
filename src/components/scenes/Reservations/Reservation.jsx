import React, {Component} from "react"
import moment from "moment"
import {Link, withRouter} from "react-router-dom"

import {List, ListItem} from "material-ui/List"

import Subheader from "material-ui/Subheader"
import RaisedButton from "material-ui/RaisedButton"

import Edit from "material-ui/svg-icons/image/edit"
import Done from "material-ui/svg-icons/action/done"
import Delete from "material-ui/svg-icons/action/delete"
import From from "material-ui/svg-icons/action/flight-land"
import To from "material-ui/svg-icons/action/flight-takeoff"
import Reject from "material-ui/svg-icons/content/redo"
import Tel from "material-ui/svg-icons/communication/call"
import Email from "material-ui/svg-icons/communication/email"
import Message from "material-ui/svg-icons/communication/message"
import Home from "material-ui/svg-icons/action/home"
import People from "material-ui/svg-icons/social/people"

import {AUTH,  RESERVATIONS_FS, TIMESTAMP, ADMINS } from "../../../utils/firebase"
import {Post, ModalDialog} from "../../shared"
import { RESERVATIONS, EDIT } from "../../../utils/routes"

class Reservation extends Component {
  
  state = {
  	isDeleting: false,
  	reservation: {
  		name: "",
  		email: "",
  		tel: "",
  		message: "",
  		adults: 1,
  		children: [],
  		roomId: null,
  		from: null,
  		to: null,
  		handled: null,
  		timestamp: null
  	}
  }


  handleReservation = handled => {
  	ADMINS.child(AUTH.currentUser.uid)
  		.once("value", snap => {
  			RESERVATIONS_FS
  				.doc(this.props.reservation.id)
  				.update({
  					handled,
  					lastHandledBy: snap.val().name,
  					timestamp: TIMESTAMP
  				})
  				.catch(e => console.error(e))
  		})
  }

  openDeleteReservation = () => this.setState({isDeleting: true})
  closeDeleteReservation = () => this.setState({isDeleting: false})
	deleteReservation = () => RESERVATIONS_FS
		.doc(this.props.reservation.id)
		.delete()
		.catch(e => console.error(e))

	componentDidMount() {
  	this.setState({reservation: this.props.reservation})
	}


	render() {
    
  	const {
  		isDeleting,
  		reservation: {
  			id,
  			name, email, tel, message, adults, children, 
  			roomId, from, to, handled,
				timestamp,
				lastHandledBy
  		}
  	} = this.state
    
		
    
  	return (
  		<ListItem disabled style={{margin: "0 auto", padding: 0}}>
  			<Post
  				title={`${name} (${moment(to).diff(moment(from), "days")+1} nap)`}
  				subtitle={`Szoba ${roomId}`}
  				rightText={<p style={{margin: "-2.5em 2.5em 0 0", textAlign: "right", color: "#aaa", fontSize: ".8em", fontStyle: "italic"}}>{!lastHandledBy ? "Foglalás dátuma" : `módosítva (${lastHandledBy})`}<br/> {moment(timestamp ? moment.unix(timestamp.seconds) : undefined).format("YYYY. MMMM DD. HH:mm:ss")}</p>}
  			> 
          
  				<List style={{display: "flex", flexWrap: "wrap"}}>
  					<Subheader>A foglaló adatai</Subheader>
  					<ListItem disabled
  						leftIcon={<Email/>}
  						primaryText={<a href={`mailto:${email}`}>{email}</a>} 
  						secondaryText="e-mail"
  					/>
  					<ListItem disabled
  						leftIcon={<Tel/>}
  						primaryText={<a href={`tel:${tel}`}>{tel}</a>} 
  						secondaryText="telefonszám"
  					/>
  					<ListItem disabled
  						style={{flexGrow: 1}}
  						leftIcon={<Message/>}
  						primaryText={message} 
  						secondaryText="üzenet"
  					/>
  					<Subheader>A foglalás részletei</Subheader>
  					<ListItem disabled
  						leftIcon={<Home/>}
  						primaryText={roomId} 
  						secondaryText="szoba"
  					/>
  					<ListItem disabled
  						leftIcon={<People/>}
  						primaryText={adults} 
  						secondaryText="felnőtt"
  					/>
  					<ListItem disabled
  						leftIcon={<People/>}
  						primaryText={(children && children.length) || "0"} 
  						secondaryText="gyerek"
  					/>
  					<ListItem disabled
  						leftIcon={<From/>}
  						primaryText={moment(from).format("MMMM D. HH:mm")} 
  						secondaryText="érkezés"
  					/>
  					<ListItem disabled
  						leftIcon={<To/>}
  						primaryText={moment(to).format("MMMM D. HH:mm")} 
  						secondaryText="távozás"
  					/>
  				</List>
  				<div style={{display: "flex", flexWrap: "wrap", justifyContent: "space-evenly", alignItems: "flex-end"}}>
  					<div style={{display: window.innerWidth <= 768 && "flex", flexGrow: 1}}>
  						{!handled &&
                <RaisedButton
                	primary
                	label={window.innerWidth >= 640 && "Elfogad"}
                	icon={<Done/>}
                	labelPosition="before"
                	onClick={() => this.handleReservation(true)}
                />
  						}
  						<Link to={`${RESERVATIONS}/${id}/${EDIT}`}>
  							<RaisedButton
  								style={{margin: "0 12px"}}
  								label={window.innerWidth >= 640 && "Szerkeszt"}
  								icon={<Edit/>}
  								labelPosition="before"
  							/>
  						</Link>
  						<RaisedButton
  							secondary
  							label={window.innerWidth >= 640 && (handled ? "Visszavon" : "Törlés")}
  							icon={handled ? <Reject/> : <Delete/>}
  							labelPosition="before"
  							onClick={() => handled ? this.handleReservation(false) : this.openDeleteReservation()}
  						/>
  					</div>

  					<ModalDialog
  						title="Foglalás végleges törlése"
  						open={isDeleting}
  						onCancel={this.closeDeleteReservation}
  						onSubmit={this.deleteReservation}
  						children="Biztosan törölni szeretné ezt a foglalást? A folyamat nem visszafordítható!"
  					/>
  				</div>
  			</Post>
  		</ListItem>
  	)
	}
}


export default withRouter(Reservation)