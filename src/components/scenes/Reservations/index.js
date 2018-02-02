import React, {Component} from 'react'

import {Tabs, Tab} from 'material-ui/Tabs'

// import SearchBar from './SearchBar'
import NewReservation from './NewReservation'
import FilteredReservations from './FilteredReservations'

import {TabLabel} from '../../shared'


export default class Reservations extends Component {
  state = {
    query: "",
    // HACK: Get the rooms dynamically
    rooms: Array(6).fill().map((x,i) => true),
    shouldToggleAll: true,
    // HACK: Find a better solution
    from: new Date(1970,1,1).getTime(),
    to: new Date(2100,12,31).getTime(),
    handled: false
  }


  handleChange = (handled) => {
    this.setState({handled})
  }

  handleOmniBar(query){
    this.setState({query})
  }

  handleRoomToggle(id){
    let {rooms} = this.state
    rooms[id] = !rooms[id]
    this.setState({rooms})
  }

  render() {
    const {query, rooms, from, to, handled} = this.state
    const {reservations, 
      // appBarRightAction, 
      unreadReservationCount} = this.props
    const readReservationCount = reservations ? Object.keys(reservations).length - unreadReservationCount : 0
    return (
      <div>
        {/* <SearchBar
          {...{appBarRightAction, rooms}}
          handleOmniBar={query => this.handleOmniBar(query)}
          handleRoomToggle={id => this.handleRoomToggle(id)}
          showHandled={handled => this.showHandled(handled)}
        /> */}
        <NewReservation/>
        <Tabs
            inkBarStyle={{marginTop: -4, height: 4}}
            value={handled}
            onChange={this.handleChange}
          >
          <Tab value={false}
            label={<TabLabel title="Új" count={unreadReservationCount}/>}
          >
            <FilteredReservations handled={false}
              {...{query, rooms, from, to, reservations}}
            />
          </Tab>
          <Tab value
            label={<TabLabel title="Elfogadott" count={readReservationCount}/>}
          >
            <FilteredReservations handled
              {...{query, rooms, from, to, reservations}}
            />
          </Tab>
        </Tabs>
      </div>
    )
  }
}