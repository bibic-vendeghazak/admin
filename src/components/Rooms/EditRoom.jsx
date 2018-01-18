import React, { Component } from 'react'
import Prices from './Prices'

export default class EditRoom extends Component {
  constructor(props) {
    super(props)
    this.state = {
      maxAdults: this.props.maxAdults,
      maxChildren: this.props.maxChildren
    }
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
    const {roomServices, id, available, populatePrices, maxAdults, maxChildren, prices} = this.props
    const services = []
    for (let key in roomServices) {
      const service = roomServices[key]
      const {inRoom, name} = service
      services.push(
        <li key={key} className="room-service">
          <div className="room-service-label">
            <p className={`${!inRoom.includes(id) && "not-available"}`}>{name}</p>
            <img src={`https://balazsorban44.github.io/bibic-vendeghazak/assets/icons/services/${key}.svg`} alt={name}/>
          </div>
          <input
            data-type={`room-service ${key}`}
            type="checkbox"
            checked={inRoom.includes(id) && 'checked'}
            onChange={e => this.handleChange(e)}/>
        </li>)
        }
    return(
      <ul className="edit-room">
        <li>
          <p className={`${!available && "not-available"}`}>Foglalt:</p>
          <input
            data-type="available"
            type="checkbox"
            checked={!available && 'checked'}
            onChange={e => this.handleChange(e)}
          />
        </li>
        {services}
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
          <Prices prices={prices} id={id}/>
        </li>
      </ul>
    )
  }
}
