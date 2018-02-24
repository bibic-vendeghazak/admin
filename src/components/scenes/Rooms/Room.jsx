import React from 'react'
import {Link} from 'react-router-dom'
import {Card, CardActions, CardMedia, CardTitle} from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'

import {colors} from '../../../utils'
import {ROOMS, EDIT} from '../../../utils/routes'


const Room = ({available, isBooked, roomId, name}) => (
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
          title={name} 
          subtitle={
            <span style={{textShadow: "0 0 5px rgba(0,0,0,.5)", textTransform: "uppercase", color: (isBooked || !available) && colors.red}}>
              {available ? 
                `${!isBooked ? "Nem" : ""} foglalt`:
                "Nem elérhető"}
            </span>
          }
        />
      }
    >
      <img
        src={`https://bibic-vendeghazak.github.io/web/assets/images/rooms/${roomId === 7 ? 1 : roomId}_0.jpg`}
        alt={name}
      />
    </CardMedia>
    <CardActions>
      <Link to={`${ROOMS}/${roomId}${EDIT}`}>
        <RaisedButton secondary label="Szerkesztés" />
      </Link>
    </CardActions>
  </Card>
  </li>
)

export default Room