import React, { Component } from 'react'
import FilteredReservations from './FilteredReservations'
import SearchBar from './SearchBar'
import {Tabs, Tab} from 'material-ui/Tabs'
import {TabLabel} from '../../utils'

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
    const {reservations, appBarRightAction} = this.props
    return (
      <div>
        <SearchBar
          {...{appBarRightAction, rooms}}
          handleOmniBar={query => this.handleOmniBar(query)}
          handleRoomToggle={id => this.handleRoomToggle(id)}
          showHandled={handled => this.showHandled(handled)}
        />
        <Tabs
          value={handled}
          onChange={this.handleChange}
        >
          <Tab 
            //FIXME: Add dynamic counter
            label={<TabLabel title="Új foglalások" count={0}/>}
            value={false}
          >
          <FilteredReservations
          handled={false}
          {...{query, rooms, from, to, reservations}}
        />
          </Tab>
          <Tab 
            //FIXME: Add dynamic counter
            label={<TabLabel title="Kezelt foglalások" count={0}/>}
            value={true}
          >
          <FilteredReservations
            handled={true}
            {...{query, rooms, from, to, reservations}}
          />
          </Tab>
        </Tabs>
      </div>
    )
  }
}