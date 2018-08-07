import React, {Component} from "react"
import moment from "moment"
import {DB, ADMINS, AUTH, FEEDBACKS_DB} from "../../../utils/firebase"

import {ListItem} from "material-ui/List"
import {Card, CardActions, CardText, CardTitle} from "material-ui/Card"
import {Divider, FlatButton} from "material-ui"
import {ModalDialog} from "../../shared"

export default class Feedback extends Component {

  state = {
    adminName: null,
    isDelete: false,
    isSubmit: false
  }

  componentDidMount() {
    DB.ref(`feedbacks/${this.props.feedbackId}/lastHandledBy`).on("value", snap => {
      if (snap.exists() && snap.val() !== "") {
        ADMINS.child(snap.val())
          .on("value", snap => snap.val() && this.setState({adminName: snap.val().name}))
      }
    })
  }

  handleMarkAccepted = () => {
    const feedbackRef = DB.ref(`feedbacks/${this.props.feedbackId}`)
    feedbackRef.update({"handled": true})
    feedbackRef.child("lastHandledBy").set(AUTH.currentUser.uid)
    this.handleCloseDialog()
  }

  handleDeleteFeedback = () => {
    FEEDBACKS_DB.child(this.props.feedbackId).remove()
    this.handleCloseDialog()
  }

  handleCloseDialog = () => this.setState({
    isDelete: false,
    isSubmit: false
  })

  handleOpenDialog = type => this.setState({[type]: true})

  render() {
    const {feedback: {
      handled, message, timestamp
    }} = this.props
    const {
      adminName, isDelete, isSubmit
    } = this.state
    return (
      <ListItem disabled>
        <ModalDialog
          onCancel={this.handleCloseDialog}
          onSubmit={this.handleMarkAccepted}
          open={isSubmit}
          title="Biztos jóváhagyja?"
        />
        <ModalDialog
          onCancel={this.handleCloseDialog}
          onSubmit={this.handleDeleteFeedback}
          open={isDelete}
          title="Biztos törölni szeretné?"
        />
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
