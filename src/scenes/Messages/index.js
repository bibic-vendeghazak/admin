import React, {Component} from 'react'
import {Route} from "react-router-dom"
import {Paper} from '@material-ui/core'
import MessagesTable from './MessagesTable'
import {MESSAGES_FS} from "../../lib/firebase"
import {toRoute, routes} from '../../utils'
import Message from './Message'


class Messages extends Component {
  state = {
    messages: null,
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
        const messages = []
        snap.forEach(message => {
          messages.push({
            id: message.id,
            ...message.data()
          })
        })
        this.setState({
          messages,
          isFetched: true
        })
      })
  }

  render() {
    const {
      messages, isFetched
    } = this.state
    return (
      <>
        <Route
          exact
          path={routes.MESSAGES}
          render={() =>
            <Paper>
              <MessagesTable
                {...{messages, isFetched}}
                showDateFilter={false}
                showRoomFilter={false}
              />
            </Paper>
          }
        />
        <Route
          component={Message}
          path={toRoute(routes.MESSAGES, ":messageId")}
        />

      </>
    )
  }
}

export default Messages