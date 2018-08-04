import React, {Component} from 'react'


import {
  Card,
  ListItem,
  RaisedButton,
  TextField
} from 'material-ui'
import {ROOMS_DB} from '../../../utils/firebase'


export default class Population extends Component {

  render() {
    const {roomId} = this.props
    return (
      <Card className="room-edit-block">
        <PeopleCount
          label="Személy"
          populateDatabase={this.populateDatabase}
          type="maxPeople"
          {...{roomId}}
        />
      </Card>
    )
  }
}

class PeopleCount extends Component {
  state = {
    count: 0,
    isEditing: false
  }


  componentDidMount() {
    const {
      roomId, type
    } = this.props
    ROOMS_DB
      .child(`${roomId-1}/prices/metadata/${type}`).on("value", snap => {
        this.setState({count: snap.val()})
      })
  }

  handleOpenEdit = () => this.setState({isEditing: true})

  handleCloseEdit = () => this.setState({isEditing: false})

  handleChange = count => this.setState({count})

  handleSave = () => {
    const {
      roomId, type
    } = this.props
    this.handleCloseEdit()
    ROOMS_DB
      .child(`${roomId-1}/prices/metadata/${type}`)
      .set(parseInt(this.state.count, 10))
  }


  render() {
    const {
      count, isEditing
    } = this.state
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
            floatingLabelText="személy"
            id={label}
            onChange={e => this.handleChange(e.target.value)}
            style={{
              flexGrow: 1,
              margin: "0 1em"
            }}
            type="number"
            value={count}
          /> :
          <p style={{
            flexGrow: 1,
            textAlign: "right",
            margin: ".5em 1em"
          }}
          >maximum
            <span style={{
              fontWeight: "bold",
              fontSize: "1.1em"
            }}
            >
              {count}</span> fő</p>
        }
        {isEditing &&
          <RaisedButton
            label="Mégse"
            onClick={() => this.handleCloseEdit()}
            style={{margin: "0 12px"}}
          />
        }
        <RaisedButton
          label={isEditing ? "Mentés" : "Módosít"}
          onClick={() => isEditing ? this.handleSave() : this.handleOpenEdit()}
          secondary
        />
      </ListItem>
    )
  }
}