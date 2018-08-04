import React, {Component} from 'react'

import {ROOMS_DB} from '../../../utils/firebase'
import {
  Card,
  Toggle,
  Dialog,
  RaisedButton
} from 'material-ui'

export default class Availability extends Component {

  state = {
    isAvailable: false,
    isDialogOpen: false
  }

  componentDidMount() {
    const roomAvailabilityRef = ROOMS_DB.child(`${this.props.roomId-1}/available`)
    roomAvailabilityRef.on("value", snap => {
      this.setState({isAvailable: snap.val()})
    })
  }


  handleDialogOpen = () => {
    this.setState({isDialogOpen: true})
  }

  handleDialogClose = () => this.setState({isDialogOpen: false})


  handleAvailability = () => {
    this.setState(({isAvailable}) => ({isAvailable: !isAvailable}), () => {
      ROOMS_DB.child(`${this.props.roomId-1}/available`)
        .set(this.state.isAvailable).then(() => this.handleDialogClose())
    })

  }


  render() {
    const {roomId} = this.props
    const {
      isAvailable, isDialogOpen
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
          <p>Szoba {roomId} jelenleg</p>
          <Dialog
            actions={[
              <RaisedButton
                label="Mégse"
                onClick={this.handleDialogClose}
              />,
              <RaisedButton
                label="Igen"
                onClick={this.handleAvailability}
                secondary
                style={{marginLeft: 12}}
              />
            ]}
            modal
            open={isDialogOpen}
            title="Foglalás"
          > Figyelem! A szobafoglalás ezzel
            <span
              style={{
                color: "red",
                fontWeight: "bold"
              }}
            >
              {isAvailable && "nem"} elérhetővé</span> válik. Biztos folytatja?
          </Dialog>
          <Toggle
            label={<div>{!isAvailable && <span style={{fontWeight: "bold"}}>nem</span>} <span style={{fontWeight: isAvailable && "bold"}}>elérhető</span></div>}
            onClick={() => this.handleDialogOpen()}
            style={{width: "auto"}}
            toggled={isAvailable}

          />
        </div>
      </Card>
    )
  }
}