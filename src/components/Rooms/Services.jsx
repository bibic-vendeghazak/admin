import React, {Component} from 'react'
import Chip from 'material-ui/Chip'
import Avatar from 'material-ui/Avatar'
import Card from 'material-ui/Card'
import firebase from 'firebase'

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
    <li className="room-service">
    <Chip 
      backgroundColor={isAvailable ? "#888" : "#ddd"}
      onClick={() => this.handleClick(serviceKey)}
    >
      <Avatar src={`https://bibic-vendeghazak.github.io/bibic-vendeghazak-web/assets/icons/services/${serviceKey}.svg`}/>
      <p>{name}</p>
    </Chip>
    </li>
  )
  }
}

const Services = ({services, roomId}) => (
  <Card className="room-edit-block">
  {roomId}
    <ul className="room-services">
      {Object.keys(services).map(serviceKey => {
        const service = services[serviceKey]
        return(
          <Service key={serviceKey} {...{...service, serviceKey, roomId}}/>
        )
      })}
    </ul>
  </Card>
)


export default Services