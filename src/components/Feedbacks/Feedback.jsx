import React from 'react'
import firebase from 'firebase/app'
import 'firebase/database'
import {ExpandableCard} from '../shared'
import {ListItem} from 'material-ui/List'

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
  const {rating, roomId, handled} = metadata
  const {message} = details
  const stars = []
  for (let i = 0; i < 5; i++){
    stars.push(<span key={i} className={`feedback-star ${i < Math.floor(rating) ?  "full" : "blank"}`}></span>)
  }

  return (
    <ListItem disabled style={{padding: 0}}>
      <ExpandableCard
        title={`Szoba ${roomId}`}
        subtitle={<div style={{display: "flex"}}>{stars}</div>}
        primaryButtonLabel="Olvasott"
        primaryButtonClick={() => markRead(true)}
        primaryButtonDisabled={handled}
        secondaryButtonLabel="Olvasatlan"
        secondaryButtonClick={() => markRead(false)}
        secondaryButtonDisabled={!handled}
        content={message}
      />
    </ListItem>
  )
}

export default Feedback
