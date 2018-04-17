import React, { Component } from 'react'

import firebase from 'firebase'

import Card from 'material-ui/Card'
import List, { ListItem } from 'material-ui/List'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField/TextField'






export default class Population extends Component {

  render() {
    const {roomId} = this.props
    return (
      <Card className="room-edit-block">
        <PeopleCount populateDatabase={this.populateDatabase} type="maxPeople" label="Személy" {...{roomId}}/>
      </Card>
    )
  }
} 

class PeopleCount extends Component {
  state = {
    count: 0,
    isEditing: false
  }

  handleOpenEdit = () => this.setState({isEditing: true})
  handleCloseEdit = () => this.setState({isEditing: false})
  
  handleChange = count => this.setState({count})

  handleSave = () => {
    const {roomId, type} = this.props
    this.handleCloseEdit()
    firebase.database()
    .ref(`rooms/${roomId-1}/prices/metadata/${type}`)
    .set(parseInt(this.state.count, 10))
  }
  
  componentDidMount() {
    const {roomId, type} = this.props
    firebase.database().ref(`rooms/${roomId-1}/prices/metadata/${type}`).on("value", snap => {
      this.setState({count: snap.val()})
    })
  }

  render() {
    const {count, isEditing} = this.state
    const {label} = this.props
    return(
      <ListItem 
        disabled 
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "baseline"
        }}
      >
        <p>{label}</p>
        {isEditing ?
          <TextField
            style={{flexGrow: 1, margin: "0 1em"}}
            floatingLabelText="személy"
            id={label}
            type="number"
            value={count}
            onChange={e => this.handleChange(e.target.value)}
          /> :
          <p style={{flexGrow: 1, textAlign: "right", margin: ".5em 1em"}}>maximum <span style={{fontWeight: "bold", fontSize: "1.1em"}}>{count}</span> fő</p>
        }
        {isEditing &&
          <RaisedButton 
            style={{margin: "0 12px"}}
            label="Mégse"
            onClick={() => this.handleCloseEdit()}
          />
        }
        <RaisedButton 
          secondary 
          label={isEditing ? "Mentés" : "Módosít"}
          onClick={() => isEditing ? this.handleSave() : this.handleOpenEdit()}
        />
      </ListItem>
    )
  }
}