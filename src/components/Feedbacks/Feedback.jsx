import React from 'react'
import firebase from 'firebase/app'
import 'firebase/database'
import {ListItem} from 'material-ui/List'

import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'

const Feedback = ({feedbackId, feedback: {rating, roomId, handled, message}}) => {

  const markRead = isRead => {
    firebase.database().ref(`feedbacks/${feedbackId}`).update({"handled": isRead})
  }

  const stars = []
  for (let i = 0; i < 5; i++){
    stars.push(<span key={i} className={`feedback-star ${i < Math.floor(rating) ?  "full" : "blank"}`}></span>)
  }

  return (
    <ListItem disabled style={{padding: ".5em 5vw"}}>
      <Card>
        <CardHeader
          title={`Szoba ${roomId}`}
          subtitle={<div style={{display: "flex"}}>{stars}</div>}
        />
        <CardText>
          {message}
        </CardText>
        <CardActions>
          {handled ?
            <RaisedButton label="Olvasatlan" onClick={() => markRead(false)}/> :
            <RaisedButton secondary label="Olvasott" onClick={() => markRead(true)}/>}
        </CardActions>
      </Card>
    </ListItem>
  )
}

export default Feedback

  