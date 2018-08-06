import React, {Component, Fragment} from 'react'
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
      <Fragment>
        <List>{feedbacks}</List>
      </Fragment> :
      <PlaceholderText>
        Nincs {styleId==="read" ? "jóváhagyott" : "jóváhagyásra váró"} visszajelzés
      </PlaceholderText>
  )
}

export default class Feedbacks extends Component {
  state = {
    feedbacks: null,
    accepted: false
  }

  componentDidMount() {
    FEEDBACKS_DB
      .on("value", snap =>
        this.setState({feedbacks: snap.val()})
      )
  }

  handleChange = () => this.setState(({accepted}) => ({accepted: !accepted}))

  render() {
    const {
      feedbacks, accepted
    } = this.state
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
        value={accepted}
      >
        <Tab
          label={
            <TabLabel
              count={unreadFeedbacks.length}
              title="Jóváhagyásra vár"
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
              title="Jóváhagyva"
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
