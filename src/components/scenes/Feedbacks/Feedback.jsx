import React, {Component} from "react"
import moment from "moment"
import { DB, ADMINS, AUTH } from "../../../utils/firebase"

import {ListItem} from "material-ui/List"
import {Card, CardActions, CardHeader, CardText} from "material-ui/Card"
import RaisedButton from "material-ui/RaisedButton"
import Read from "material-ui/svg-icons/content/drafts"
import Unread from "material-ui/svg-icons/content/mail"

export default class Feedback extends Component {

  state = {
  	adminName: ""
  }

  markRead = isRead => {
  	const feedbackRef = DB.ref(`feedbacks/${this.props.feedbackId}`)
  	feedbackRef.update({"handled": isRead})
  	feedbackRef.child("lastHandledBy").set(AUTH.currentUser.uid)
  }

  componentDidMount() {
  	DB.ref(`feedbacks/${this.props.feedbackId}/lastHandledBy`).on("value", snap => {
  		ADMINS.child(snap.val()).on("value", snap => snap.val() && this.setState({adminName: snap.val().name}))
  	})
  }

  render() {
  	const {feedback: {rating, roomId, handled, message, timestamp}} = this.props
  	const {adminName} = this.state
  	return (
  		<ListItem disabled style={{padding: ".5em 5vw"}}>
  			<Card>
  				<CardHeader
  					style={{paddingBottom: 8}}
  					title={`Szoba ${roomId}`}
  					subtitle={<div style={{display: "flex"}}>{
  						Array(5).map((e,i) => (
  							// REVIEW: Fix stars
  							<span key={i} className={`feedback-star ${i < Math.floor(rating) ?  "full" : "blank"}`}></span>
  						))
  					}</div>}
  				/>
  				<CardText style={{padding: "0 1em"}}>
  					{message}
  				</CardText>
  				<p style={{margin: 12, textAlign: "center", fontSize: ".8em"}}>Visszajelzést utoljára kezelte: {adminName === "" ? "Még senki": adminName}</p>

  				<CardActions>
  					<div style={{display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end"}}>
  						{handled ?
  							<RaisedButton
  								label="Olvasatlan"
  								icon={<Unread/>}
  								labelPosition="before"
  								onClick={() => this.markRead(false)}
  							/> :
  							<RaisedButton secondary
  								label="Olvasott"
  								icon={<Read/>}
  								labelPosition="before"
  								onClick={() => this.markRead(true)}
  							/>
  						}
  						<p style={{marginTop: "1em", color: "#ccc", fontSize: ".8em", fontStyle: "italic"}}>Visszajelzés beküldve: {moment(timestamp).format("YYYY. MMMM DD. HH:mm")}</p>
  					</div>
  				</CardActions>
  			</Card>
  		</ListItem>
  	)
  }
}
  