import React, { Component } from 'react'

export default class SearchBar extends Component {
  constructor(){
    super()
    this.state = {
      showFilters: true
    }
  }

  toggleFilters() {
    const showFilters = !this.state.showFilters
    this.setState({showFilters})
  }

  handleOmniBar(e) {
    this.props.handleOmniBar(e.target.value)
  }

  handleRoomToggle(id) {
    this.props.handleRoomToggle(id)
  }

  toggleRoomsState() {
    for (var i = 0; i < document.querySelectorAll(".room-filter").length; i++) {
      this.props.handleRoomToggle(i)
    }
  }

  handleDate(e){
    const event = e.target
    const type = event.getAttribute("data-type")
    const value = new Date(event.value).getTime()
    this.props.handleDate(type, value)
  }

  render() {
    const {showFilters} = this.state
    const {rooms} = this.props
    let roomFilters = []
    for (let i = 0; i < rooms.length; i++) {
      roomFilters.push(
        <li key={i}>
          <a
            className={`room-filter filter-checkbox ${rooms[i] && "checked"}`}
            onClick={() => this.handleRoomToggle(i)}
          >
            Szoba {i+1}
          </a>
        </li>
      )
    }
    return(
      <div id="reservations-search" className="search-bar">
        <button
          className={`toggle-filter-btn ${showFilters && "checked"}`}
          onClick={() => this.toggleFilters()}
        />
        <div className="omnibar">
          <input
            placeholder="Keresés a foglalások között"
            onInput={e => this.handleOmniBar(e)}
          />
          <button className="green-btn"/>
        </div>
        <div className={`filters ${!showFilters && "hidden"}`}>
          <div className="filter-search">
            <h4>Szűrés szobák szerint
              <a
                className="toggle-all"
                onClick={() => this.toggleRoomsState()}
              >Összes mutatása/elrejtése
              </a>
            </h4>
            <ul>
              {roomFilters}
            </ul>
            <h4>Szűrés dátum szerint</h4>
            <div className="filter-date">
              <div>
                <label>Érkezés</label>
                <input
                  type="date"
                  onChange={e => this.handleDate(e)}
                  data-type="from"
                />
              </div>
              <div>
                <label>Távozás</label>
                <input
                  type="date"
                  onChange={e => this.handleDate(e)}
                  data-type="to"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
     )

  }
}
