import React, {Component} from "react"
import moment from "moment"
import {AUTH, FEEDBACKS_DB, getAdminName} from "../../../utils/firebase"

import {ListItem} from "material-ui/List"
import {Card, CardActions, CardText, CardTitle} from "material-ui/Card"
import {Divider, FlatButton} from "material-ui"

export default class Feedback extends Component {

  state = {
    adminName: null,
    loggedInAdminName: ""
  }

  componentDidMount() {
    FEEDBACKS_DB
      .child(`${this.props.feedbackId}/lastHandledBy`)
      .on("value", snap => this.setState({adminName: snap.val()}))
    getAdminName(AUTH.currentUser.uid)
      .then(snap => this.setState({loggedInAdminName: snap.val()}))
  }

  handleMarkAccepted = () => {
    FEEDBACKS_DB.child(this.props.feedbackId)
      .update({
        handled: true,
        lastHandledBy: this.state.loggedInAdminName
      })
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
      <ListItem disabled>
        <Card>
          <CardTitle
            actAsExpander
            showExpandableButton
            subtitle={`jóváhagyta • ${adminName || "Még senki" }`}
            title={`${message.split(" ").slice(0, 3).join(" ")}...`}
          >
          </CardTitle>
          <CardText expandable>
            {message}
            <p style={{
              color: "grey",
              fontSize: 12
            }}
            >
              {moment(timestamp).format("YYYY. MMMM DD. HH:mm")}
            </p>
          </CardText>
          <Divider/>
          <CardActions>
            {!handled &&
                <FlatButton
                  label="Jóváhagy"
                  onClick={() => this.handleOpenDialog("isSubmit")}
                />
            }
            <FlatButton
              label="Töröl"
              onClick={() => this.handleOpenDialog("isDelete")}
              secondary
            />
          </CardActions>
          >
        </Card>
      </ListItem>
    )
  }
}
