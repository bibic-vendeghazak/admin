import React, {Component} from "react"
import {Route} from "react-router-dom"
import QueryString from "query-string"
import {Tabs, Tab} from "material-ui"
import SearchBar from "./SearchBar"
import NewReservation from "./NewReservation"
import FilteredReservations from "./FilteredReservations"
import BigReservation from "./BigReservation"
import {TabLabel} from "../../shared"
import {RESERVATIONS, EDIT} from "../../../utils/routes"
import {RESERVATIONS_FS} from "../../../utils/firebase"
import Store from "../../App/Store"

const emptyReservations = {
  handledReservations: [],
  unHandledReservations: [],
  unHandledReservationCount: 0,
  handledReservationCount: 0
}

export default class Reservations extends Component {

  state = {
    ...emptyReservations,
    handledState: false
  }

  static getDerivedStateFromProps(props, state) {
    return {
      ...state,
      handledState: QueryString.parse(props.location.search).kezelt === "igen"
    }
  }

  componentDidMount() {
    this.updateReservations(null, null, [1])
    window.addEventListener("keyup", this.handleKeyUp, false)
  }

  handleKeyUp = ({keyCode}) => {
    switch (keyCode) {
    case 85:
      this.props.history.push(`${RESERVATIONS}/uj`)
      break
    default:
      break
    }

  }


  updateReservations = (from, to, roomsToShow) => {
    let query = RESERVATIONS_FS
    // -tól
    if (from) query = query.where("from", ">=", from.unix()*1000)
    // -ig
    if (to) query = query.where("from", "<=", to.unix()*1000)

    /**
     * REVIEW: As of 2018.04.22 Firestore does not support IN operator
     * For now, client side filtering is required
     * @see <a href="https://github.com/firebase/firebase-js-sdk/issues/321">Issue #321</a>
     *
     * if (roomsToShow.length) {
     *   query = query.in("roomId", roomsToShow)
     * }
     */


    /*
     * REVIEW: Do not use onSnapshot here,
     * as it triggers even when component is not mounted
     */
    query
      .limit(100)
      .onSnapshot(snap => {
        this.setState(prevState => ({
          ...prevState,
          ...emptyReservations
        }))
        snap.forEach(reservationSnap => {
          const reservation = reservationSnap.data()
          const {id} = reservationSnap
          if(!reservation.handled){
            this.setState(({
              unHandledReservationCount, unHandledReservations
            }) => ({
              unHandledReservationCount: unHandledReservationCount+1,
              unHandledReservations: [
                ...unHandledReservations,
                {
                  ...reservation,
                  id
                }
              ]
            }))
          } else {
            this.setState(({
              handledReservationCount, handledReservations
            }) => ({
              handledReservationCount: handledReservationCount+1,
              handledReservations: [
                ...handledReservations,
                {
                  ...reservation,
                  id
                }
              ]
            }))
          }
        })
      })
  }


  render() {
    const {
      handledReservations, handledReservationCount,
      unHandledReservations, unHandledReservationCount,
      handledState
    } = this.state
    return (
      <Store.Consumer>
        {({rooms}) =>
          <div>
            <Route
              component={() => <SearchBar {...{rooms}}/>}
              path={RESERVATIONS}
            />
            <NewReservation/>
            <Tabs
              inkBarStyle={{
                marginTop: -4,
                height: 4
              }}
              value={handledState}
            >
              <Tab
                label={
                  <TabLabel
                    count={unHandledReservationCount}
                    title="Kezeletlen"
                    to={`${RESERVATIONS}?kezelt=nem`}
                  />
                }
                value={false}
              >
                <FilteredReservations
                  {...{
                    rooms,
                    reservations: unHandledReservations
                  }}
                />
              </Tab>
              <Tab
                label={
                  <TabLabel
                    count={handledReservationCount}
                    title="Kezelt"
                    to={`${RESERVATIONS}?kezelt=igen`}
                  />
                }
                value
              >
                <FilteredReservations
                  {...{
                    rooms,
                    reservations: handledReservations
                  }}
                />
              </Tab>
            </Tabs>
            <Route
              exact
              path={`${RESERVATIONS}/:reservationId/${EDIT}`}
              render={({
                match, history
              }) =>
                <BigReservation {...{
                  match,
                  history,
                  rooms
                }}
                />
              }
            />
          </div>}
      </Store.Consumer>
    )
  }
}
