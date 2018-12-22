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

import {ROOM_SERVICES_DB} from "../../lib/firebase"
import hu from "../../lang/hu"
import {Loading} from '../shared'

class Service extends Component {

  state = {available: false}

  componentDidMount = async () => {
    this.inRoomRef = ROOM_SERVICES_DB.child(`${this.props.serviceKey}/inRoom`)
    this.inRoomRef.on("value", snap => {
      this.setState({available: Object.values(snap.val()).some(e => e===this.props.roomId)})
    })
  }

  componentWillUnmount() {this.inRoomRef.off()}

  handleClick = async () => {
    const {roomId, sendNotification} = this.props
    try {
      if (this.state.available) {
        const inRooms = await (await this.inRoomRef.once("value")).val()
        const roomToRemove = Object.keys(inRooms).find(room => inRooms[room] === roomId)
        await this.inRoomRef.child(roomToRemove).remove()
      } else {
        await this.inRoomRef.push(roomId)
      }
      sendNotification({
        code: "success",
        message: hu.notifications.saved
      })
    } catch (error) {
      sendNotification(error)
    }
  }


  render() {
    const {serviceKey, name, icon} = this.props
    const {available} = this.state
    return (
      <ListItem button onClick={this.handleClick}>
        <ListItemIcon><img alt={serviceKey} src={icon} width={24}/></ListItemIcon>
        <ListItemText>{name}</ListItemText>
        <Typography>{
          available ?
            hu.rooms.editRoom.sections.services.has :
            hu.rooms.editRoom.sections.services.hasNot
        }</Typography>
        <Switch checked={available} onClick={this.handleClick}/>
      </ListItem>
    )
  }
}

class Services extends Component {
  state = {services: []}

  componentDidMount = async () => {
    const {roomId} = this.props
    const services = []
    try {
      const data = await (await (ROOM_SERVICES_DB.once("value")))
      data.forEach(roomService => {
        const {inRoom, ...rest} = roomService.val()
        services.push({
          key: roomService.key,
          available: Object.values(inRoom).includes(roomId),
          ...rest
        })
      })
      this.setState({services})
    } catch (error) {
      this.props.sendNotification(error)
    }
  }

  render() {
    const {roomId, sendNotification} = this.props
    const {services} = this.state
    return (
      <Card>
        <CardContent>
          <List dense disablePadding>
            {services.length ? services.map(
              service =>
                <Service
                  style={{flexGrow: 1}}
                  {...{
                    serviceKey: service.key,
                    ...service,
                    roomId: roomId+1,
                    sendNotification
                  }}
                />
            ) : <Loading/>
            }
          </List>
        </CardContent>
      </Card>
    )
  }
}


export default Services