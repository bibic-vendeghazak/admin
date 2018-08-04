import React, {Component, Fragment} from "react"
import {PARAGRAPHS_DB} from "../../../utils/firebase"


import {
  Card,
  CardActions,
  RaisedButton,
  TextField
} from "material-ui"

import Edit from "material-ui/svg-icons/image/edit"
import Delete from "material-ui/svg-icons/action/delete"
import Save from "material-ui/svg-icons/content/save"
import Cancel from "material-ui/svg-icons/navigation/cancel"

export default class TextParagraph extends Component {

  state = {
    text: null,
    isEditing: false
  }


  handleOpenEdit = () => this.setState({isEditing: true})

  handleCloseEdit = () => this.setState({isEditing: false})

  handleTextChange = ({target: {value: text}}) => this.setState({text})


  handleSubmitText = () =>
    PARAGRAPHS_DB.child(this.props.path)
      .update({text: this.state.text})
      .then(this.handleCloseEdit)

  handleDeleteParagraph = () => PARAGRAPHS_DB.child(this.props.path).remove()

  render() {
    const {
      text, isEditing
    } = this.state

    return (
      <Card style={{
        cursor: "grabbing",
        "marginBottom": "2.5em"
      }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1em"
          }}
        >
          {isEditing ?
            <TextField
              floatingLabelText="bekezdés szövege"
              fullWidth
              id="text"
              multiLine
              // REVIEW: Seems to be a hacky solution. Try something else...?
              onChange={this.handleTextChange}
              value={text || this.props.text}
            /> :
            <p
              onClick={this.handleOpenEdit}
              style={{
                cursor: "pointer",
                userSelect: "none"
              }}
            >{this.props.text || "Üres"}</p>
          }

        </div>
        <CardActions>
          {isEditing ?
            <div>
              <RaisedButton
                icon={<Cancel/>}
                label={"Mégse"}
                labelPosition="before"
                onClick={this.handleCloseEdit}
                style={{margin: 12}}
              />
              <RaisedButton
                icon={<Save/>}
                label={"Mentés"}
                labelPosition="before"
                onClick={this.handleSubmitText}
                secondary
              />
            </div> :
            <Fragment>
              <RaisedButton
                icon={<Edit/>}
                label={window.innerWidth >= 640 && "Módosít"}
                labelPosition="before"
                onClick={this.handleOpenEdit}
                style={{margin: "0 12px"}}
              />
              <RaisedButton
                icon={<Delete/>}
                label={window.innerWidth >= 640 && "Törlés"}
                labelPosition="before"
                onClick={this.handleDeleteParagraph}
                secondary
              />
            </Fragment>
          }
        </CardActions>
      </Card>
    )
  }
}