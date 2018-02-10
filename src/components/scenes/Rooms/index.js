import React, {Component} from 'react'
import Room from './Room'
import BigRoom from './BigRoom'
import firebase from 'firebase'



export default class Rooms extends Component {
  
  state = {
    isBigRoom: false,
    bigRoom: null,
    roomServices: [],
    rooms: []
  }

  componentDidMount() {
    firebase.database().ref("rooms").on("value", snap => {
      this.setState({
        rooms: snap.val(), 
        // bigRoom: snap.val()[0]
      })
    })
    firebase.database().ref("roomServices").on("value", snap => {
      this.setState({roomServices: snap.val()})
    })
  }

    // FIXME: Clicking on hamburger menu triggers closeBigDay()
  componentWillReceiveProps({appBarRightAction}) {
    if (appBarRightAction === "rooms" && this.state.isBigRoom) {
      this.closeBigRoom()
    }
  }

  handleRoomClick = roomId => {
    this.props.changeAppBarRightIcon(["close", "Bezárás"])
    
    const {rooms, roomServices} = this.state
    const services = {}
    Object.keys(roomServices).forEach(roomService => {
      const {name, inRoom} = roomServices[roomService]
      services[roomService] = {
        name, isAvailable: Object.values(inRoom).includes(roomId)
      }
    })
    
    this.setState({
      isBigRoom: true,
      bigRoom: {
        ...rooms[roomId-1],
        services
      }
    })
  }

  closeBigRoom = () => {
    this.props.changeAppBarRightIcon([null, null])
    this.setState({isBigRoom: false})
  }

  render() {
    const {roomsBooked} = this.props
    const {rooms, isBigRoom, bigRoom} = this.state
    
    return (
      isBigRoom ? 
        <BigRoom 
          closeBigRoom={this.closeBigRoom}
          {...{...bigRoom}}
        /> :
        <ul className="rooms">
          {rooms.map(({id, available, name}, index) => (
            <Room
              key={id}
              roomId={id}
              isBooked={roomsBooked[index]} 
              handleRoomClick={this.handleRoomClick}
              {...{available, name}}
            />
            )
          )}
        </ul>
    )
  }
}