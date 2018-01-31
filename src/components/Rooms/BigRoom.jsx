import React, { Component } from 'react'
import firebase from "firebase"

import Services from './Services'
import Population from './Population'
import Prices from './Prices'
import Availability from './Availability'
import Description from './Description'

import Subheader from 'material-ui/Subheader'

export default class BigRoom extends Component {
  constructor(props) {
    super(props)
    this.state = {
      maxAdults: props.maxAdults,
      maxChildren: props.maxChildren
    }
  }

  handleRoomEdit(event) {
    const e = event.target
    const {id} = this.state
    let dataType = e.getAttribute("data-type")
    if (dataType.includes("room-service")) {
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

  handleChange(e) {
    this.props.handleRoomEdit(e)
    console.log("yo");
  }

  render(){
    const {services, id: roomId} = this.props
    return(
      <div className="big-room">
        <Subheader style={{marginLeft: "1.5em"}}>Szoba {roomId} állapota</Subheader>
        <Availability {...{roomId}}/>
        <Subheader style={{marginLeft: "1.5em"}}>Szoba {roomId} leírása</Subheader>
        <Description {...{roomId}}/>
        <Subheader style={{marginLeft: "1.5em"}}>Szolgáltatások (Szoba {roomId})</Subheader>
        <Services {...{services, roomId}}/>
        <Subheader style={{marginLeft: "1.5em"}}>Lakók száma (Szoba {roomId})</Subheader>
        <Population {...{roomId}}/>
        <Subheader style={{marginLeft: "1.5em"}}>Ártáblázat (Szoba {roomId})</Subheader>
        <Prices {...{roomId}}/>
      </div>
    )
  }
}
