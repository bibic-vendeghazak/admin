import React, {Component} from 'react'

import firebase from 'firebase'

import {colors} from '../../utils'

import Card from 'material-ui/Card'
import Toggle from 'material-ui/Toggle'
import List, {ListItem} from 'material-ui/List'

const {orange, lightOrange} = colors

class Service extends Component {
  
  state = {
    isAvailable: false
  }

  componentDidMount() {
    const roomServiceRef = firebase.database().ref(`roomServices/${this.props.serviceKey}`)
    const inRoomRef = roomServiceRef.child("inRoom")
    inRoomRef.on("value", snap => {
      this.setState({
        isAvailable: Object.values(snap.val()).some(e => e===this.props.roomId)
      })
    })
  }

  componentWillUnmount() {
    const roomServiceRef = firebase.database().ref(`roomServices/${this.props.serviceKey}`)
    const inRoomRef = roomServiceRef.child("inRoom")
    inRoomRef.off()
  }
  
  handleClick = serviceKey => {
    const roomServiceRef = firebase.database().ref(`roomServices/${serviceKey}`)
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
    const {serviceKey, name} = this.props
    const {isAvailable} = this.state
    return (
    <ListItem 
    onClick={() => this.handleClick(serviceKey)}
    rightIcon={
      <Toggle
        style={{width: "auto"}}
        label={isAvailable ? "Van": "Nincs"}
        toggled={isAvailable}
        thumbStyle={{backgroundColor: "#eee"}}
        trackStyle={{backgroundColor: "#ddd"}}
        thumbSwitchedStyle={{backgroundColor: orange}}
        trackSwitchedStyle={{backgroundColor: lightOrange}}
        
      />
    }
    >
      <div style={{display: "flex", alignItems: "center"}}>
        <img width={24} style={{padding: "0 8px"}} alt={serviceKey} src={`https://bibic-vendeghazak.github.io/bibic-vendeghazak-web/assets/icons/services/${serviceKey}.svg`}/>
        <p>{name}</p>
      </div>
    </ListItem>
  )
  }
}

const Services = ({services, roomId}) => (
  <Card className="room-edit-block">
  {roomId}
    <List className="room-services">
      {services && Object.keys(services).map(serviceKey => {
        const service = services[serviceKey]
        return(
          <Service key={serviceKey} style={{flexGrow: 1}} {...{...service, serviceKey, roomId}}/>
        )
      })}
    </List>
  </Card>
)


export default Services