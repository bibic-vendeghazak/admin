import React, {Component} from 'react'
import Room from './Room'
import {Route} from 'react-router-dom'
import BigRoom from './BigRoom'
import firebase from 'firebase'
import { ROOMS, EDIT } from '../../../utils/routes';



export default class Rooms extends Component {
  
  state = {
    rooms: []
  }

  componentDidMount() {
    firebase.database().ref("rooms").on("value", snap => {
      this.setState({
        rooms: snap.val(), 
      })
    })
    firebase.database().ref("roomServices").on("value", snap => {
      this.setState({roomServices: snap.val()})
    })
  }



  render() {
    return (
      <div>
        <Route path={ROOMS+"/:roomId"+EDIT} component={BigRoom}/>
        <Route exact path={ROOMS} render={() => (
          <ul className="rooms">
            {this.state.rooms.map(({id, available, name}, index) => (
              <Room
                key={id}
                roomId={id}
                isBooked={true} 
                {...{available, name}}
              />
              )
            )}
          </ul>
        )
          
        }/>
      </div>
    )
  }
}
