import React, {Component} from 'react'


import firebase from 'firebase'

import {colors} from '../../utils'

import Card from 'material-ui/Card'
import Toggle from 'material-ui/Toggle'
import Dialog from 'material-ui/Dialog'
import RaisedButton from 'material-ui/RaisedButton'

const {orange, lightOrange} = colors

export default class Availability extends Component {
  
  state = {
    isAvailable: false,
    isDialogOpen: false
  }

  componentDidMount() {
    const roomAvailabilityRef = firebase.database().ref(`rooms/${this.props.roomId-1}/available`)
    roomAvailabilityRef.on("value", snap => {
      this.setState({
        isAvailable: snap.val()
      })
    })
  }
  
  
  handleDialogOpen = () => {
    this.setState({isDialogOpen: true})
  }

  handleDialogClose = () => this.setState({isDialogOpen: false})


  handleAvailability = () => {
    this.setState(({isAvailable}) => ({
      isAvailable: !isAvailable
    }), () => {
      firebase.database().ref(`rooms/${this.props.roomId-1}/available`)
      .set(this.state.isAvailable).then(() => this.handleDialogClose())
    })

  }

  
  render() {
    const {roomId} = this.props
    const {isAvailable, isDialogOpen} = this.state
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
          <p>Szoba {roomId} jelenleg</p>
          <Dialog 
            title="Foglalás"
            modal
            open={isDialogOpen}
            actions={[
              <RaisedButton
                label="Mégse"
                onClick={this.handleDialogClose}
              />,
              <RaisedButton
                style={{marginLeft: 12}}
                secondary
                label="Igen"
                onClick={this.handleAvailability}
              />
            ]}
          > Figyelem! A szobafoglalás ezzel <span style={{color: "red", fontWeight: "bold"}}>{isAvailable && "nem"} elérhetővé</span> válik. Biztos folytatja?
          </Dialog>
          <Toggle
            label={<div>{!isAvailable && <span style={{fontWeight: "bold"}}>nem</span>} <span style={{fontWeight: isAvailable && "bold"}}>elérhető</span></div>}
            onClick={() => this.handleDialogOpen()}
            style={{width: "auto"}}
            toggled={isAvailable}
            thumbStyle={{backgroundColor: "#eee"}}
            trackStyle={{backgroundColor: "#ddd"}}
            thumbSwitchedStyle={{backgroundColor: orange}}
            trackSwitchedStyle={{backgroundColor: lightOrange}}
          />
        </div>
      </Card>
  )
  }
}