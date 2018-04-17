import React, {Component} from 'react'
import moment from 'moment'
import {Tabs, Tab} from 'material-ui/Tabs'
import {Route} from 'react-router-dom'
// import SearchBar from './SearchBar'
import NewReservation from './NewReservation'
import FilteredReservations from './FilteredReservations'
import {EditReservation} from './Reservation'
import {TabLabel} from '../../shared'
import { firebase } from '@firebase/app';


export default class Reservations extends Component {
  state = {
    handledReservations: null,
    unHandledReservations: null,
    unHandledReservationCount: 0,
    handledReservationCount: 0,
    query: "",
    // HACK: Get the rooms dynamically
    rooms: Array(6).fill().map((x,i) => true),
    shouldToggleAll: true,
    // HACK: Find a better solution
    from: new Date(1970,1,1).getTime(),
    to: new Date(2100,12,31).getTime()
  }

  componentDidMount() {
    firebase.database().ref("/reservations").on("value", snap => {
      let unHandledReservationCount = 0
      let handledReservationCount = 0
      let handledReservations = {}
      let unHandledReservations = {}
      snap.forEach(reservation => {
          const {handled, roomId, from, to} = reservation.val()
  
          if(!handled){
            unHandledReservationCount+=1
            unHandledReservations = {
              ...unHandledReservations,
              [reservation.key]: reservation.val()
            }
          } else {
            handledReservationCount+=1
            handledReservations = {
              ...handledReservations,
              [reservation.key]: reservation.val()
            }
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
          this.setState({
            unHandledReservations,
            handledReservations,
            unHandledReservationCount,
            handledReservationCount
          })
      })
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
    const {query, rooms, from, to, 
      handledReservations, handledReservationCount, 
      unHandledReservations, unHandledReservationCount
    } = this.state
    const {match} = this.props 
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
            value={match.params.readState === "kezelt"}
            onChange={this.handleChange}
          >
          <Tab value={false}
            label={<TabLabel title="Új" count={unHandledReservationCount}/>}
          >
            <FilteredReservations
              {...{query, rooms, from, to, reservations: unHandledReservations}}
            />
          </Tab>
          <Tab value
            label={<TabLabel title="Elfogadott" count={handledReservationCount}/>}
          >
            <FilteredReservations
              {...{query, rooms, from, to, reservations: handledReservations}}
            />
          </Tab>
        </Tabs>
        <Route exact path={`${match.url}/:reservationId/szerkeszt`} component={EditReservation}/>
      </div>
    )
  }
}
