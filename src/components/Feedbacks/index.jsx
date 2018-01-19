import React, {Component} from 'react'
import Feedback from './Feedback'
import {Tabs, Tab} from 'material-ui/Tabs'
import {TabLabel} from '../../utils'

const FeedbackList = ({styleId, feedbacks}) => {
  return(
    <div className={`posts-${styleId}`}>
      {feedbacks.length !== 0 ?
        <ul id={`${styleId}-feedbacks`}>
          {feedbacks}
        </ul> : <p>Nincs olvasatlan visszajelzés</p>}
    </div>
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
      const feedbackComponent = <Feedback key={key} id={key} feedback={feedback}/>
      !feedback.metadata.handled ? unreadFeedbacks.push(feedbackComponent) : readFeedbacks.push(feedbackComponent)
    }
  return (
    <Tabs
      value={this.state.read}
      onChange={this.handleChange}
    >
      <Tab value={false} label={<TabLabel title="Új visszajelzések" count={unreadFeedbacks.length}/>}>
        <FeedbackList styleId="unread" feedbacks={unreadFeedbacks}/>
      </Tab>
      <Tab value={true} label={<TabLabel title="Olvasott visszajelzések" count={readFeedbacks.length}/>}>
        <FeedbackList styleId="read" feedbacks={readFeedbacks}/>
      </Tab>
    </Tabs>
  )
}
}
