import React, {Component} from 'react'
import moment from 'moment'
import {Tabs, Tab} from 'material-ui/Tabs'

// import SearchBar from './SearchBar'
import NewReservation from './NewReservation'
import FilteredReservations from './FilteredReservations'

import {TabLabel} from '../../shared'
import { firebase } from '@firebase/app';


export default class Reservations extends Component {
  state = {
    reservations: null,
    handledReservations: null,
    unreadReservationCount: 0,
    query: "",
    // HACK: Get the rooms dynamically
    rooms: Array(6).fill().map((x,i) => true),
    shouldToggleAll: true,
    // HACK: Find a better solution
    from: new Date(1970,1,1).getTime(),
    to: new Date(2100,12,31).getTime()
  }

  componentDidMount() {
    const reservationsRef = firebase.database().ref("/reservations")
    reservationsRef.on("value", snap => {
      const reservations = snap.val()
      let unreadReservationCount = 0
      const handledReservations = {}
      reservations && Object.keys(reservations).forEach(reservation => {
        const {metadata: {handled, roomId, from, to}} = reservations[reservation]
        
        if(!handled){
          unreadReservationCount+=1
        } else {
          handledReservations[reservation] = reservations[reservation]        
          if (
            moment.range(moment(from), moment(to))
            .overlaps(
              moment.range(moment().startOf("day"), moment().endOf("day"))
          )) {
            this.setState({roomsBooked: {
              ...this.state.roomsBooked,
              [roomId-1]: true
            }})
          }
        }
      })
      this.setState({reservations, handledReservations, unreadReservationCount})
    })
  }


  handleChange = readState => {
    if (readState) {
      this.props.history.replace("kezelt","kezeletlen")
    } else {
      this.props.history.replace("kezeletlen","kezelt")
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

  render() {
    const {query, rooms, from, to, reservations, unreadReservationCount} = this.state
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
            value={this.props.match.params.readState === "kezelt"}
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