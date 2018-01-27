import React, { Component } from 'react'
import firebase from "firebase"

import Prices from './Prices'
import Services from './Services'


export default class BigRoom extends Component {
  constructor(props) {
    super(props)
    this.state = {
      maxAdults: this.props.maxAdults,
      maxChildren: this.props.maxChildren
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

  changeValue(type, direction, minValue = 0) {
    // FIXME: Change value
    // if (this.state[type]+minValue > 0) {
    //   this.setState({
    //     [type]: this.state[type] + direction
    //   })
    // }
  }

  render(){
    const {services, id: roomId, populatePrices, maxAdults, maxChildren, prices} = this.props
    return(
      <ul className="edit-room">
        <Services {...{services, roomId}}/>
        <li>
          <p>Maximum felnőtt: </p>
          <div className="change-people">
            <button  onClick={(e, direction, minValue) => this.changeValue("maxAdults",-1, 1)}>-</button>
            <input
              min="1"
              data-type="max-people maxAdults"
              className="room-number-input"
              type="number"
              onChange={e => this.handleChange(e)}
              value={maxAdults}/>
            <button  onClick={(e, direction, minValue) => this.changeValue("maxAdults",1,1)}>+</button>
          </div>
        </li>
        <li>
          <p>Maximum gyerek: </p>
          <div className="change-people">
            <button onClick={(e,direction) => this.changeValue("maxChildren",-1)}>-</button>
            <input
              min="0"
              data-type="max-people maxChildren"
              className="room-number-input"
              type="number"
              onChange={e => this.handleChange(e)}
              value={maxChildren}/>
            <button onClick={(e,direction) => this.changeValue("maxChildren",1)}>+</button>
          </div>
        </li>
        <li className="room-populate-btn">
          <button onClick={() => populatePrices()}>Ár opciók frissítése</button>
        </li>
        <li>
          <Prices {...{roomId, prices}}/>
        </li>
      </ul>
    )
  }
}
