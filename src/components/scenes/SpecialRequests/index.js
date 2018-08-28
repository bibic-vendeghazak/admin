import React, {Component} from 'react'
import {Paper} from '@material-ui/core'
import SpecialRequestsTable from './SpecialRequestsTable'
import {SPECIAL_REQUESTS_FS} from '../../../utils/firebase'


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
    )
  }
}

export default SpecialRequests