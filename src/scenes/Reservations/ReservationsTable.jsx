import React, {Component} from 'react'
import {withStore} from "../../db"
import {Loading, EmptyTableBody, withToolbar} from "../../components/shared"
import FilteredReservations from './FilteredReservations'

import moment from 'moment'

import {RESERVATIONS_FS} from "../../lib/firebase"


import {Table, TableBody} from "@material-ui/core"
import TableHead from './TableHead'

class ReservationsTable extends Component {

  state = {
    isLoading: false,
    handledReservations: null,
    unhandledReservations: null,
    order: 'desc',
    orderBy: 'timestamp'
  }


  componentDidMount() {
    this.getReservations()
  }


  componentDidUpdate = ({reservationsFilters: {from, to}}) => {

    const {reservationsFilters} = this.props

    if (from !== reservationsFilters.from || to !== reservationsFilters.to) this.getReservations()
  }

  getReservations = () => {
    const {reservationsFilters: {from, to}, sendNotification} = this.props

    this.setState({isLoading: true})
    Promise.all([
      RESERVATIONS_FS
        .where("handled", "==", false)
        .onSnapshot(snap => {
          const unhandledReservations = []
          snap.forEach(reservation =>
            unhandledReservations
              .push({
                key: reservation.id,
                ...reservation.data()
              })
          )
          this.setState({unhandledReservations})
        }, sendNotification),
      RESERVATIONS_FS
        .orderBy("from")
        .where("handled", "==", true)
        .startAt(moment(from).toDate())
        .endAt((to ? moment(to) : moment().add(2, "months")).toDate())
        .limit(200)
        .onSnapshot(snap => {
          const handledReservations = []
          snap.forEach(reservation =>
            handledReservations
              .push({
                key: reservation.id,
                ...reservation.data()
              })
          )
          this.setState({handledReservations})
        }, sendNotification)
    ]).then(() => this.setState({isLoading: false}))
  }


  handleRequestSort = property =>
    this.setState(({
      orderBy, order
    }) => ({
      order: (orderBy === property && order === 'desc') ? "asc" : "desc",
      orderBy: property
    }))


  render() {
    const {
      order, orderBy, isLoading,
      handledReservations, unhandledReservations
    } = this.state
    const {
      reservationsFilters
    } = this.props

    return(
      <Table>
        <TableHead
          onRequestSort={this.handleRequestSort}
          {...{
            order,
            orderBy
          }}
        />
        <TableBody>
          {
            (handledReservations && unhandledReservations && !isLoading) ?
              <FilteredReservations
                {...{
                  query: reservationsFilters.query,
                  filteredRooms: reservationsFilters.filteredRooms,
                  order,
                  orderBy,
                  handledReservations,
                  unhandledReservations
                }}
              /> :
              <EmptyTableBody title={<Loading/>}/>
          }
        </TableBody>
      </Table>
    )
  }
}


export default withStore(withToolbar(ReservationsTable))