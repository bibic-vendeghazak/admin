import React, { Component } from 'react'
import EditRoom from './EditRoom'
import firebase from 'firebase/app'
import 'firebase/database'


export default class Room extends Component {
  constructor() {
    super()
    this.state = {
      isEditOpen: false
    }
  }

  componentWillMount() {
    const {id} = this.props.room
    const dbRef = firebase.database()
    const roomRef = dbRef.ref(`rooms/${id-1}`)
    const roomServicesRef = dbRef.ref(`roomServices/`)
    const pricesRef = roomRef.child('prices/')
    roomRef.on('value', snap => {
      const room = {}
      Object.keys(snap.val()).forEach(key => {
        const value = snap.val()[key]
        room[key] = value
      })
      this.setState(prevState => Object.assign(room, prevState.isEditOpen))
    })
    roomServicesRef.on('value', snap => {
      this.setState({roomServices: snap.val()})
    })
    pricesRef.on('value', snap => {
      this.setState({prices: snap.val()})
    })
  }

  editRoomToggle(e) {
    this.setState(prevState => (
      {isEditOpen: !prevState.isEditOpen}
    ))
  }

  handleRoomEdit(event) {
    const e = event.target
    const {id} = this.state
    let dataType = e.getAttribute("data-type")
    if (dataType === "available") {
      this.setState(prevState => ({[dataType]: !prevState[dataType]}))
      firebase.database().ref(`/rooms/${id-1}/available`).set(!this.state[dataType])

    } else if (dataType.includes("room-service")) {
      // Handle room service changes
      const {roomServices} = this.state
      dataType = dataType.replace("room-service ","")
      let {inRoom} = roomServices[dataType]

      inRoom.includes(id) ? inRoom = inRoom.filter(e => e !== id) : inRoom.push(id)
      firebase.database().ref(`/roomServices/${dataType}/inRoom`).set(inRoom)
    } else if(dataType.includes("max-people")) {
      dataType = dataType.replace("max-people ","")
      let {value} = e
      value = parseInt(value,10) || 0
      firebase.database().ref(`/rooms/${id-1}/${dataType}`).set(value)
    }
    // NOTE: Update firebase
  }

  populatePrices(){
    const {id} = this.state
    const dbRef = firebase.database()
    const roomRef = dbRef.ref(`rooms/${id-1}`)
    let {prices, maxAdults, maxChildren} = this.state
    Object.keys(prices).forEach(key => {
      for (let i = 0; i < maxAdults; i++) {
        for (let j = 0; j <= maxChildren; j++) {
          if (i+j <= maxAdults) {
            if(!prices[key][`${i+1}_${j}`]) {
              prices[key][`${i+1}_${j}`] = {
                adults: i+1,
                children: j,
                price: 0
              }
            }
          }
        }
      }
      // Remove rest of the prices.
      const priceType = prices[key]
      Object.keys(priceType).forEach(key => {
        const {adults, children} = priceType[key]
        if (adults > maxAdults || children > maxChildren) {
          delete priceType[key]
        }
      })
    })
    roomRef.child("/prices").set(prices)
  }

  render(){
    const {isEditOpen, available, id, maxAdults, maxChildren, roomServices, prices} = this.state
        return (
      <li className="room" key={id}>
        <div className="room-header">
          <h4>Szoba {id}</h4>
          <img src={`https://bibic-vendeghazak.github.io/bibic-vendeghazak-web/assets/images/rooms/${id}_0.jpg`} alt={`Szoba ${id}`}/>
          <span/>
        </div>
        <button className={`edit-room-btn ${isEditOpen && "edit-room-btn-active"}`} onClick={() => this.editRoomToggle()}>{isEditOpen ? "✗" : "Szerkesztés"}</button>
        <div className="room-overview">
          <div className="room-availability">
            <p>
              A szoba jeleneleg <span style={{color: "red"}}>{available && "nem" }</span> foglalt.
            </p>
          </div>
        </div>
        {isEditOpen &&
          <EditRoom
            populatePrices={() => this.populatePrices()}
            handleRoomEdit={e => this.handleRoomEdit(e)}
            {...{available, id, maxAdults, maxChildren, roomServices, prices}}
          />
        }
      </li>
    )
  }
}
