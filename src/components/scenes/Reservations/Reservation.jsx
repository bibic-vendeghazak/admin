import React, {Component} from "react"
import moment from "moment"
import QueryString from "query-string"
import {Link, withRouter} from "react-router-dom"

import {List, ListItem} from "material-ui/List"

import Subheader from "material-ui/Subheader"
import RaisedButton from "material-ui/RaisedButton"

import Done from "material-ui/svg-icons/action/done"
import Edit from "material-ui/svg-icons/image/edit"
import Delete from "material-ui/svg-icons/action/delete"
import From from "material-ui/svg-icons/action/flight-land"
import To from "material-ui/svg-icons/action/flight-takeoff"
import Reject from "material-ui/svg-icons/content/redo"
import Tel from "material-ui/svg-icons/communication/call"
import Email from "material-ui/svg-icons/communication/email"
import Message from "material-ui/svg-icons/communication/message"
import Home from "material-ui/svg-icons/action/home"
import Adult from "material-ui/svg-icons/social/people"
import Child from "material-ui/svg-icons/places/child-care"
import Money from "material-ui/svg-icons/editor/attach-money"

import {AUTH,  RESERVATIONS_FS, TIMESTAMP, ADMINS } from "../../../utils/firebase"
import {Post, ModalDialog} from "../../shared"
import { RESERVATIONS, EDIT, HANDLED } from "../../../utils/routes"

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
				price=0,
  			roomId, from, to, handled,
				timestamp,
				lastHandledBy
  		}
  	} = this.state
		
		const expanded = this.props.location.search.includes(id)
		const handledStatus = QueryString.parse(this.props.location.search).kezelt || "nem"
  	return (
  		<ListItem disabled style={{margin: "0 auto", padding: 0}}>
  			<Post
					{...{expanded}}
  				title={`${name} (${moment(to && (to.seconds*1000 || to)).diff(moment(from && (from.seconds*1000 || from)), "days")+1} nap)`}
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
  						leftIcon={<Adult/>}
  						primaryText={adults} 
  						secondaryText="felnőtt"
  					/>
  					<ListItem disabled
  						leftIcon={<Child/>}
  						primaryText={(children && children.length) || "0"} 
  						secondaryText="gyerek"
  					/>
						<ListItem disabled
  						leftIcon={<Money/>}
  						primaryText={
								(price)
									.toLocaleString("hu-HU", {
										style: "currency", currency: "HUF",
										maximumFractionDigits: 0,
										minimumFractionDigits: 0
									})} 
  						secondaryText="fizetni"
  					/>
  					<ListItem disabled
  						leftIcon={<From/>}
  						primaryText={moment(from && (from.seconds*1000 || from)).format("MMMM D. HH:mm")} 
  						secondaryText="érkezés"
  					/>
  					<ListItem disabled
  						leftIcon={<To/>}
  						primaryText={moment(to && (to.seconds*1000 || to)).format("MMMM D. HH:mm")} 
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
  						<Link to={`${RESERVATIONS}/${id}/${EDIT}?kezelt=${handledStatus}`}>
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