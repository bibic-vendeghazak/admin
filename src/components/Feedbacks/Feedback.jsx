import React, {Component} from 'react'
import firebase from 'firebase'
import moment from 'moment'

import {ListItem} from 'material-ui/List'

import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'

export default class Feedback extends Component {

  state = {
    adminName: ""
  }

  markRead = isRead => {
    const feedbackRef = firebase.database().ref(`feedbacks/${this.props.feedbackId}`)
    feedbackRef.update({"handled": isRead})
    feedbackRef.child('lastHandledBy').set(firebase.auth().currentUser.uid)
  }

  componentDidMount() {
    const db = firebase.database()
    db.ref(`feedbacks/${this.props.feedbackId}/lastHandledBy`).on('value', snap => {
      db.ref(`admins/${snap.val()}`).on("value", snap => snap.val() && this.setState({adminName: snap.val().name}))
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
                <RaisedButton label="Megjelölés olvasatlanként" onClick={() => this.markRead(false)}/> :
                <RaisedButton secondary label="Megjelölés olvasottként" onClick={() => this.markRead(true)}/>}
                <p style={{marginTop: "1em", color: "#ccc", fontSize: ".8em", fontStyle: "italic"}}>Visszajelzés beküldve: {moment(timestamp).format("YYYY. MMMM DD. HH:mm")}</p>
            </div>
          </CardActions>
        </Card>
      </ListItem>
    )
  }
}
  