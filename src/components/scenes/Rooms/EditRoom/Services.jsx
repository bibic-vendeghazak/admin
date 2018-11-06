import React, {Component} from 'react'

import {
  Card,
  Switch,
  List,
  CardContent,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography
} from '@material-ui/core'

import Store from '../../../App/Store'
import {ROOM_SERVICES_DB} from '../../../../lib/firebase'


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
    const {roomId, sendNotification} = this.props
    const success = {
      code: "success",
      message: "Mentve."
    }
    if (this.state.isAvailable) {
      inRoomRef.once("value", snap => {
        const inRoom = snap.val()
        Object.keys(inRoom).forEach(room => {
          if (inRoom[room] === roomId) {
            inRoomRef.child(room).remove()
              .then(() => sendNotification(success))
              .catch(sendNotification)
          }
        })
      })
    } else {
      inRoomRef.push().set(roomId)
        .then(() => sendNotification(success))
        .catch(sendNotification)
    }
  }


  render() {
    const {
      serviceKey, name
    } = this.props
    const {isAvailable} = this.state
    return (
      <ListItem
        button
        onClick={() => this.handleClick(serviceKey)}
      >
        <ListItemIcon>
          <img
            alt={serviceKey}
            src={`https://bibic-vendeghazak.github.io/web/assets/icons/services/${serviceKey}.svg`}
            width={24}
          />
        </ListItemIcon>
        <ListItemText>{name}</ListItemText>
        <Typography>{isAvailable ? "Van": "Nincs"}</Typography>
        <Switch
          checked={isAvailable}
          onClick={() => this.handleClick(serviceKey)}
        />
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
      <Card>
        <CardContent>
          <Store.Consumer>
            {({sendNotification}) =>
              <List
                dense
                disablePadding
              >
                {services && Object.keys(services).map(serviceKey => {
                  const service = services[serviceKey]
                  return(
                    <Service
                      key={serviceKey}
                      style={{flexGrow: 1}}
                      {...{
                        ...service,
                        serviceKey,
                        roomId,
                        sendNotification
                      }}
                    />
                  )
                })}
              </List>
            }
          </Store.Consumer>
        </CardContent>
      </Card>
    )
  }
}


export default Services