import React, {Component} from 'react'


import firebase from 'firebase'


import Card, { CardActions } from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField/TextField'

export default class Description extends Component {
  
  state = {
    description: "",
    isEditing: false
  }

  componentDidMount() {
    firebase.database()
    .ref(`rooms/${this.props.roomId-1}/description`)
    .on("value", snap => {
      this.setState({
        description: snap.val()
      })
    })
  }
  
  
  handleOpenEdit = () => {
    this.setState({isEditing: true})
  }

  handleCloseEdit = () => this.setState({isEditing: false})


  handleDescriptionChange = description => this.setState({description})


  handleSubmitDescription = () => {
    firebase.database()
      .ref(`rooms/${this.props.roomId-1}/description`)
      .set(this.state.description).then(() => this.handleCloseEdit())
    
  }

  
  render() {
    const {description, isEditing} = this.state
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
            id="description"
            floatingLabelText="leírás"
            fullWidth
            multiLine
            value={description}
            onChange={e => this.handleDescriptionChange(e.target.value)}
          /> :
          <p>{description}</p>
        }

        </div>
        <CardActions style={{display: "flex", justifyContent: "flex-end"}}> 
          {isEditing ?
            <div>
              <RaisedButton
                style={{margin: 12}}
                label={"Mégse"}
                onClick={() => this.handleCloseEdit()}
              />
              <RaisedButton
                secondary
                label={"Mentés"}
                onClick={() => this.handleSubmitDescription()}
              />
            </div> :
            <RaisedButton
              secondary
              label={"Módosít"}
              onClick={() => this.handleOpenEdit()}
            />
          }
        </CardActions>
      </Card>
  )
  }
}