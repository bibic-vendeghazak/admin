import React from 'react'
import {Card, CardActions, CardMedia, CardTitle} from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'
import {colors} from '../../utils'

const Room = ({isBooked, handleRoomClick, roomId}) => (
  <li className="room">
   <Card>
    <CardMedia
      className="room-bg"
      overlay={
        <CardTitle 
          style={{
            padding: 8
          }}
          titleStyle={{
            lineHeight: 1,
            fontSize: "1.1em"
          }}
          subtitleStyle={{
            fontSize: ".8em"
          }}
          className="room-title"
          title={`Szoba ${roomId}`} 
          subtitle={<span style={{color: isBooked && colors.orange}}>{!isBooked && "NEM"} FOGLALT</span>}
          />
        }
    >
      <img
        src={`https://bibic-vendeghazak.github.io/bibic-vendeghazak-web/assets/images/rooms/${roomId}_0.jpg`}
        alt={`Szoba ${roomId}`}
      />
    </CardMedia>
    <CardActions>
      <RaisedButton secondary onClick={() => handleRoomClick(roomId)} label="Szerkesztés" />
    </CardActions>
  </Card>
  </li>
)

export default Room