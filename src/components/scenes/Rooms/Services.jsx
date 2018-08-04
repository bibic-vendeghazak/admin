import React, {Component} from 'react'

import {
  Card,
  Toggle,
  List,
  ListItem
} from 'material-ui'

import {ROOM_SERVICES_DB} from '../../../utils/firebase'


class Service extends Component {

  state = {isAvailable: false}

  componentDidMount() {
    const roomServiceRef = ROOM_SERVICES_DB.child(`${this.props.serviceKey}`)
    const inRoomRef = roomServiceRef.child("inRoom")
    inRoomRef.on("value", snap => {
      this.setState({isAvailable: Object.values(snap.val()).some(e => e===this.props.roomId)})
    })
  }

  componentWillUnmount() {
    const roomServiceRef = ROOM_SERVICES_DB.child(`${this.props.serviceKey}`)
    const inRoomRef = roomServiceRef.child("inRoom")
    inRoomRef.off()
  }

  handleClick = serviceKey => {
    const roomServiceRef = ROOM_SERVICES_DB.child(`${serviceKey}`)
    const inRoomRef = roomServiceRef.child("inRoom")
    if (this.state.isAvailable) {
      inRoomRef.once("value", snap => {
        const inRoom = snap.val()
        Object.keys(inRoom).forEach(room => {
          if (inRoom[room] === this.props.roomId) {
            inRoomRef.child(room).remove()
          }
        })
      })
    } else {
      inRoomRef.push().set(this.props.roomId)
    }
  }


  render() {
    const {
      serviceKey, name
    } = this.props
    const {isAvailable} = this.state
    return (
      <ListItem
        onClick={() => this.handleClick(serviceKey)}
        rightIcon={
          <Toggle
            label={isAvailable ? "Van": "Nincs"}
            style={{width: "auto"}}
            toggled={isAvailable}
          />
        }
      >
        <div style={{
          display: "flex",
          alignItems: "center"
        }}
        >
          <img
            alt={serviceKey}
            src={`https://bibic-vendeghazak.github.io/web/assets/icons/services/${serviceKey}.svg`}
            style={{padding: "0 8px"}}
            width={24}
          />
          <p>{name}</p>
        </div>
      </ListItem>
    )
  }
}

class Services extends Component {
  state = {services: null}

  componentDidMount() {
    const {roomId} = this.props
    const services = {}
    ROOM_SERVICES_DB.once("value").then(data => {
      data.forEach(roomService => {
        const {
          name, inRoom
        } = roomService.val()
        services[roomService.key] = {
          name,
          isAvailable: Object.values(inRoom).includes(roomId)
        }
      })
      this.setState({services})
    })
  }

  render() {
    const {roomId} = this.props
    const {services} = this.state
    return (
      <Card className="room-edit-block">
        <List className="room-services">
          {services && Object.keys(services).map(serviceKey => {
            const service = services[serviceKey]
            return(
              <Service
                key={serviceKey}
                style={{flexGrow: 1}}
                {...{
                  ...service,
                  serviceKey,
                  roomId
                }}
              />
            )
          })}
        </List>
      </Card>
    )
  }
}


export default Services