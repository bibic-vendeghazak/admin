import React, { Component } from 'react'
import FilteredReservations from './FilteredReservations'
import SearchBar from './SearchBar'
import {Tabs, Tab} from 'material-ui/Tabs'
import {TabLabel} from '../../utils'

import NewReservation, {NewReservationButton} from './NewReservation'

export default class Reservations extends Component {
  state = {
    query: "",
    // HACK: Get the rooms dynamically
    rooms: Array(6).fill().map((x,i) => true),
    shouldToggleAll: true,
    // HACK: Find a better solution
    from: new Date(1970,1,1).getTime(),
    to: new Date(2100,12,31).getTime(),
    handled: false,
    isDialogOpen: false
  }

  openDialog = () => this.setState({isDialogOpen: true})
  handleDialogToggle = () => this.setState(({isDialogOpen}) => ({isDialogOpen: !isDialogOpen}))
  handleCancelDialog = () => this.setState({isDialogOpen: false})
  handleSubmitDialog = () => this.setState({isDialogOpen: false})


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
    const {query, rooms, from, to, handled, isDialogOpen} = this.state
    const {reservations, appBarRightAction, unreadReservationCount} = this.props
    const readReservationCount = reservations ? Object.keys(reservations).length - unreadReservationCount : 0
    return (
      <div>
        <SearchBar
          {...{appBarRightAction, rooms}}
          handleOmniBar={query => this.handleOmniBar(query)}
          handleRoomToggle={id => this.handleRoomToggle(id)}
          showHandled={handled => this.showHandled(handled)}
        />
        {
          isDialogOpen &&
            <NewReservation
              {...{isDialogOpen}}
              handleCancelDialog={this.handleCancelDialog}
              handleSubmitDialog={this.handleSubmitDialog}
              handleDialogToggle={this.handleDialogToggle}
            />
        }
        <NewReservationButton openDialog={this.openDialog}/>
        <Tabs
          value={handled}
          onChange={this.handleChange}
        >
          <Tab 
            label={<TabLabel title="Új" count={unreadReservationCount}/>}
            value={false}
          >
          <FilteredReservations
          handled={false}
          {...{query, rooms, from, to, reservations}}
        />
          </Tab>
          <Tab 
            label={<TabLabel title="Elfogadott" count={readReservationCount}/>}
            value
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