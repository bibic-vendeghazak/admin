import React, {Component} from 'react'

import {Tabs, Tab} from 'material-ui/Tabs'
import {List} from 'material-ui/List'

import Feedback from './Feedback'

import {TabLabel, PlaceholderText} from '../../shared'

const FeedbackList = ({styleId, feedbacks}) => {
  return(
      feedbacks.length !== 0 ?
        <List>{feedbacks}</List> : 
        <PlaceholderText>Nincs {styleId==="read" ? "olvasott" : "olvasatlan"} visszajelzés</PlaceholderText>
  )
}


export default class Feedbacks extends Component {
  state = {
    read: false
  }
  
  handleChange = (read) => {
    this.setState({read})
  }
  render() {
    const {feedbacks} = this.props
    const unreadFeedbacks = []
    const readFeedbacks = []
    for (let key in feedbacks) {
      const feedback = feedbacks[key]
      const feedbackComponent = <Feedback key={key} feedbackId={key} feedback={feedback}/>
      !feedback.handled ? unreadFeedbacks.push(feedbackComponent) : readFeedbacks.push(feedbackComponent)
    }
  return (
    <Tabs
      inkBarStyle={{marginTop: -4, height: 4}}
      value={this.state.read}
      onChange={this.handleChange}
    >
      <Tab value={false} label={<TabLabel title="Olvasatlan" count={unreadFeedbacks.length}/>}>
        <FeedbackList styleId="unread" feedbacks={unreadFeedbacks}/>
      </Tab>
      <Tab value={true} label={<TabLabel title="Olvasott" count={readFeedbacks.length}/>}>
        <FeedbackList styleId="read" feedbacks={readFeedbacks}/>
      </Tab>
    </Tabs>
  )
}
}
