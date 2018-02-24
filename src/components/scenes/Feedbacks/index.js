import React, {Component} from 'react'
import firebase from 'firebase'
import {Tabs, Tab} from 'material-ui/Tabs'
import {List} from 'material-ui/List'

import Feedback from './Feedback'

import {TabLabel, PlaceholderText} from '../../shared'

const FeedbackList = ({styleId, feedbacks}) => {
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
    firebase.database()
      .ref("feedbacks")
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
    for (let key in feedbacks) {
      const feedback = feedbacks[key]
      const feedbackComponent = <Feedback key={key} feedbackId={key} feedback={feedback}/>
      !feedback.handled ? 
      unreadFeedbacks.push(feedbackComponent) : 
      readFeedbacks.push(feedbackComponent)
    }
    
    return (
      <Tabs
        inkBarStyle={{marginTop: -4, height: 4}}
        value={this.props.match.params.readState === "olvasott"}
        onChange={this.handleChange}
      >
        <Tab
          value={false}
          label={
            <TabLabel 
              title="Olvasatlan" 
              count={unreadFeedbacks.length}
            />
          }
        >
          <FeedbackList styleId="unread" feedbacks={unreadFeedbacks}/>
        </Tab>
        <Tab 
          value 
          label={
            <TabLabel
              title="Olvasott"
              count={readFeedbacks.length}
            />
          }
        >
          <FeedbackList styleId="read" feedbacks={readFeedbacks}/>
        </Tab>
      </Tabs>
    )
  }
}
