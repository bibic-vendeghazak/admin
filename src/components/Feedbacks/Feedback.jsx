import React from 'react'
import firebase from 'firebase/app'
import 'firebase/database'

const Feedback = ({id, feedback}) => {

  const handleClick = event => {
    const e = event.target
    e.parentNode.parentNode.children[1].classList.toggle("hidden")
    e.classList.toggle("rotated")
  }

  const markRead = isRead => {
    firebase.database().ref(`feedbacks/metadata/${id}`).update({"handled": isRead})
  }

  const {metadata, details} = feedback
  const {rating, roomId} = metadata
  const {message} = details
  const stars = []
  for (let i = 0; i < 5; i++){
    stars.push(<span key={i} className={`feedback-star ${i < Math.floor(rating) ?  "full" : "blank"}`}></span>)
  }

  return (
      <li className="feedback post">
        <div className="post-header">
          <div>
            <p>Szoba {roomId}</p>
            {stars}
          </div>
          <span
            className="post-toggle"
            onClick={(e) => handleClick(e)}
          >▼</span>
        </div>
        <div className="post-body hidden">
          <div className="feedback-message">
            <p>{message}</p>
          </div>
          <div className="feedback-read post-handle">
            <span
              className="read-feedback green-btn"
              onClick={() => markRead(true)}
            >✓</span>
            <span
              className="unread-feedback red-btn"
              onClick={() => markRead(false)}
            >✗</span>
          </div>
        </div>
      </li>
  )
}

export default Feedback
