import React, {Component} from "react"
import moment from "moment"
import {DB, ADMINS, AUTH, FEEDBACKS_DB} from "../../../utils/firebase"

import {ListItem} from "material-ui/List"
import {Card, CardActions, CardText} from "material-ui/Card"
import RaisedButton from "material-ui/RaisedButton"
import Done from "material-ui/svg-icons/action/done"
import Delete from "material-ui/svg-icons/action/delete"

export default class Feedback extends Component {

  state = {adminName: ""}

  componentDidMount() {
    DB.ref(`feedbacks/${this.props.feedbackId}/lastHandledBy`).on("value", snap => {
      if (snap.val() !== "") {
        ADMINS.child(
          snap.val())
          .on("value", snap => snap.val() && this.setState({adminName: snap.val().name}))
      }
    })
  }

  handleMarkAccepted = () => {
    const feedbackRef = DB.ref(`feedbacks/${this.props.feedbackId}`)
    feedbackRef.update({"handled": true})
    feedbackRef.child("lastHandledBy").set(AUTH.currentUser.uid)
  }

  handleDeleteFeedback = () => {
    FEEDBACKS_DB.child(this.props.feedbackId).remove()
  }


  render() {
    const {feedback: {
      handled, message, timestamp
    }} = this.props
    const {adminName} = this.state
    return (
      <ListItem
        disabled
        style={{padding: ".5em 5vw"}}
      >
        <Card
          style={{position: "relative"}}
        >
          <p style={{
            padding: "1em",
            color: "#ccc",
            fontSize: ".8em",
            textAlign: "right",
            fontStyle: "italic"
          }}
          >
            {adminName !== "" && `jóváhagyta: ${adminName}`} <br/>
          </p>
          <CardText>
            {message}
          </CardText>
          <CardActions >
            {!handled &&
                <RaisedButton
                  icon={<Done/>}
                  label="Jóváhagyás"
                  labelPosition="before"
                  onClick={this.handleMarkAccepted}
                  primary
                />
            }
            <RaisedButton
              icon={<Delete/>}
              label="Törlés"
              labelPosition="before"
              onClick={this.handleDeleteFeedback}
              secondary
            />
          </CardActions>
          <p style={{
            padding: "1em",
            color: "#ccc",
            fontSize: ".8em",
            textAlign: "right",
            fontStyle: "italic"
          }}
          >
                beküldve: {moment(timestamp).format("YYYY. MMMM DD. HH:mm")}
          </p>
        </Card>
      </ListItem>
    )
  }
}
