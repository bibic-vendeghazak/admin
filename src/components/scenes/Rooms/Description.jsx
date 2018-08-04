import React, {Component} from 'react'

import {
  Card,
  CardActions,
  RaisedButton,
  TextField
} from 'material-ui'

import {ROOMS_DB} from '../../../utils/firebase'

export default class Description extends Component {

  state = {
    description: "",
    isEditing: false
  }

  componentDidMount() {
    ROOMS_DB
      .child(`${this.props.roomId-1}/description`)
      .on("value", snap => {
        this.setState({description: snap.val()})
      })
  }


  handleOpenEdit = () => {
    this.setState({isEditing: true})
  }

  handleCloseEdit = () => this.setState({isEditing: false})


  handleDescriptionChange = description => this.setState({description})


  handleSubmitDescription = () => {
    ROOMS_DB
      .child(`${this.props.roomId-1}/description`)
      .set(this.state.description).then(() => this.handleCloseEdit())

  }


  render() {
    const {
      description, isEditing
    } = this.state
    return (
      <Card className="room-edit-block">
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
              floatingLabelText="leírás"
              fullWidth
              id="description"
              multiLine
              onChange={e => this.handleDescriptionChange(e.target.value)}
              value={description}
            /> :
            <p>{description}</p>
          }

        </div>
        <CardActions style={{
          display: "flex",
          justifyContent: "flex-end"
        }}
        >
          {isEditing ?
            <div>
              <RaisedButton
                label={"Mégse"}
                onClick={() => this.handleCloseEdit()}
                style={{margin: 12}}
              />
              <RaisedButton
                label={"Mentés"}
                onClick={() => this.handleSubmitDescription()}
                secondary
              />
            </div> :
            <RaisedButton
              label={"Módosít"}
              onClick={() => this.handleOpenEdit()}
              secondary
            />
          }
        </CardActions>
      </Card>
    )
  }
}