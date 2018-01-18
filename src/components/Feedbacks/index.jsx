import React from 'react'
import Feedback from './Feedback'

const Feedbacks = ({feedbacks}) => {

  const unreadFeedbacks = []
  const readFeedbacks = []
const FeedbackList = ({type, styleId, feedbacks}) => {
  return(
    <div className={`posts-${styleId}`}>
      <h3 className="posts-header">{type} visszajelzések<span className="notification-counter">{feedbacks.length}</span></h3>
      {feedbacks.length !== 0 ?
        <ul id={`${styleId}-feedbacks`}>
          {feedbacks}
        </ul> : <p>Nincs olvasatlan visszajelzés</p>}
    </div>
  )
}
  for (let key in feedbacks) {
    const feedback = feedbacks[key]
    const feedbackComponent = <Feedback key={key} id={key} feedback={feedback}/>
    !feedback.metadata.handled ? unreadFeedbacks.push(feedbackComponent) : readFeedbacks.push(feedbackComponent)
  }

  return (
    <div id="feedback-wrapper" className="posts-wrapper">
      <FeedbackList type="Új" styleId="unread" feedbacks={unreadFeedbacks}/>
      <FeedbackList type="Régi" styleId="read" feedbacks={readFeedbacks}/>
    </div>
  )
}

export default Feedbacks
