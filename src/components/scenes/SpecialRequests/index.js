import React, {Component, Fragment} from 'react'
import {Route} from "react-router-dom"
import {Paper} from '@material-ui/core'
import SpecialRequestsTable from './SpecialRequestsTable'
import {SPECIAL_REQUESTS_FS} from '../../../utils/firebase'
import {toRoute, routes} from '../../../utils'
import SpecialRequest from './SpecialRequest'


class SpecialRequests extends Component {
  state = {
    specialRequests: null,
    isFetched: false
  }


  componentDidMount() {
    this.fetchSpecialRequests()
  }

  fetchSpecialRequests = () => {
    this.setState({isFetched: false})
    SPECIAL_REQUESTS_FS
      .get()
      .then(snap => {
        const specialRequests = []
        snap.forEach(specialRequest => {
          specialRequests.push({
            id: specialRequest.id,
            ...specialRequest.data()
          })
        })
        this.setState({
          specialRequests,
          isFetched: true
        })
      })
  }

  render() {
    const {
      specialRequests, isFetched
    } = this.state
    return (
      <Fragment>
        <Route
          exact
          path={routes.SPECIAL_REQUESTS}
          render={() =>
            <Paper>
              <SpecialRequestsTable
                {...{
                  specialRequests,
                  isFetched
                }}
                showDateFilter={false}
                showRoomFilter={false}
              />
            </Paper>
          }
        />
        <Route
          component={SpecialRequest}
          path={toRoute(routes.SPECIAL_REQUESTS, ":specialRequestId")}
        />

      </Fragment>
    )
  }
}

export default SpecialRequests