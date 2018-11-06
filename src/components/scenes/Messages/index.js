import React, {Component, } from 'react'
import {Route} from "react-router-dom"
import {Paper} from '@material-ui/core'
import MessagesTable from './MessagesTable'
import {MESSAGES_FS} from '../../../lib/firebase'
import {toRoute, routes} from '../../../utils'
import Message from './Message'


class Messages extends Component {
  state = {
    Messages: null,
    isFetched: false
  }


  componentDidMount() {
    this.fetchMessages()
  }

  fetchMessages = () => {
    this.setState({isFetched: false})
    MESSAGES_FS
      .get()
      .then(snap => {
        const Messages = []
        snap.forEach(Message => {
          Messages.push({
            id: Message.id,
            ...Message.data()
          })
        })
        this.setState({
          Messages,
          isFetched: true
        })
      })
  }

  render() {
    const {
      Messages, isFetched
    } = this.state
    return (
      <>
        <Route
          exact
          path={routes.SPECIAL_REQUESTS}
          render={() =>
            <Paper>
              <MessagesTable
                {...{
                  Messages,
                  isFetched
                }}
                showDateFilter={false}
                showRoomFilter={false}
              />
            </Paper>
          }
        />
        <Route
          component={Message}
          path={toRoute(routes.SPECIAL_REQUESTS, ":messageId")}
        />

      </>
    )
  }
}

export default Messages