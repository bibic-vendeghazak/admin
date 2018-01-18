import React, { Component } from 'react'
import FilteredReservations from './FilteredReservations'
import SearchBar from './SearchBar'

export default class Reservations extends Component {
  constructor(props) {
    super(props)
    this.state = {
      query: "",
      // HACK: Get the rooms dynamically
      rooms: Array(6).fill().map((x,i) => true),
      shouldToggleAll: true,
      // HACK: Find a better solution
      from: new Date(1970,1,1).getTime(),
      to: new Date(2100,12,31).getTime(),
      handled: false
    }
  }

  handleOmniBar(query){
    this.setState({query})
  }

  handleRoomToggle(id){
    let {rooms} = this.state
    rooms[id] = !rooms[id]
    this.setState({rooms})
  }


  showHandled(handled){
    this.setState({handled})
  }

  render() {
    const {query, rooms, from, to, handled} = this.state
    const {reservations} = this.props
    return (
      <div id="reservations-wrapper" className="posts-wrapper">
        <SearchBar
          rooms={rooms}
          handleOmniBar={query => this.handleOmniBar(query)}
          handleRoomToggle={id => this.handleRoomToggle(id)}
          showHandled={handled => this.showHandled(handled)}
        />
        <ul className="reservation-handled-btn">
          <li
            className={`${!handled ? "active-handle-filter" : ""}`}
            onClick={() => this.showHandled(false)}
          >
            <p>
              Új foglalások
            </p>
          </li>
          <li
            className={`${handled ? "active-handle-filter" : ""}`}
            onClick={() => this.showHandled(true)}
          >
            <p>
              Kezelt foglalások
            </p>
          </li>
        </ul>
        <FilteredReservations
          {...{query, rooms, from, to, handled, reservations}}
        />
      </div>
    )
  }
}
