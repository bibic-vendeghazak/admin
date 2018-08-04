import React, {Component} from 'react'
import {
  Tabs,
  Tab,
  List
} from 'material-ui'

import Feedback from './Feedback'

import {TabLabel, PlaceholderText} from '../../shared'
import {FEEDBACKS_DB} from '../../../utils/firebase'

const FeedbackList = ({
  styleId, feedbacks
}) => {
  return (
    feedbacks.length !== 0 ?
      <List>{feedbacks}</List> :
      <PlaceholderText>
      Nincs {styleId==="read" ? "olvasott" : "olvasatlan"} visszajelzés
      </PlaceholderText>
  )
}

export default class Feedbacks extends Component {
  state = {feedbacks: null}

  componentDidMount() {
    FEEDBACKS_DB
      .on("value", snap =>
        this.setState({feedbacks: snap.val()})
      )
  }

  handleChange = readState => {
    if (readState) {
      this.props.history.replace("olvasott","olvasatlan")
    } else {
      this.props.history.replace("olvasatlan","olvasott")
    }
  }

  render() {
    const {feedbacks} = this.state
    const unreadFeedbacks = []
    const readFeedbacks = []
    for (const key in feedbacks) {
      const feedback = feedbacks[key]
      const feedbackComponent =
        <Feedback
          feedback={feedback}
          feedbackId={key}
          key={key}
        />
      !feedback.handled ?
        unreadFeedbacks.push(feedbackComponent) :
        readFeedbacks.push(feedbackComponent)
    }

    return (
      <Tabs
        inkBarStyle={{
          marginTop: -4,
          height: 4
        }}
        onChange={this.handleChange}
        value={this.props.match.params.readState === "olvasott"}
      >
        <Tab
          label={
            <TabLabel
              count={unreadFeedbacks.length}
              title="Olvasatlan"
            />
          }
          value={false}
        >
          <FeedbackList
            feedbacks={unreadFeedbacks}
            styleId="unread"
          />
        </Tab>
        <Tab
          label={
            <TabLabel
              count={readFeedbacks.length}
              title="Olvasott"
            />
          }
          value
        >
          <FeedbackList
            feedbacks={readFeedbacks}
            styleId="read"
          />
        </Tab>
      </Tabs>
    )
  }
}
