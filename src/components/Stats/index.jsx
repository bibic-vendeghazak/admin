import React, { Component } from 'react'

export default class Stats extends Component {
  constructor(){
    super()
    this.state = {
      totalReservations: 0,
      mostActiveRoom: 0,
      leastActiveRoom: 0,
      feedbackPerRooms: {}
    }
  }
  componentDidMount(){
    const reservations = this.props.reservations
    const feedbacks = this.props.feedbacks
    let totalReservations = 0
    let reservationPerRooms = {}
    let feedbackPerRooms = {}
    for (let reservation in reservations) {
      if (reservations[reservation].metadata.handled) {
        // How many reservations are there?
        totalReservations++

        // Separate reservations by room
        if (!reservationPerRooms[reservations[reservation].metadata.roomId]) {
          reservationPerRooms[reservations[reservation].metadata.roomId] = 1
        } else {
          reservationPerRooms[reservations[reservation].metadata.roomId]++
        }
      }
    }
    for (let feedback in feedbacks) {
      if (feedbacks[feedback].metadata.handled) {
        if (!feedbackPerRooms[feedbacks[feedback].metadata.roomId]) {
          feedbackPerRooms[feedbacks[feedback].metadata.roomId] = []
          feedbackPerRooms[feedbacks[feedback].metadata.roomId].push(feedbacks[feedback].metadata.rating)
        } else {
          feedbackPerRooms[feedbacks[feedback].metadata.roomId].push(feedbacks[feedback].metadata.rating)
        }
      }

    }

    for (let key in feedbackPerRooms) {
      feedbackPerRooms[key] = feedbackPerRooms[key].reduce((a, b) => a + b, 0)/feedbackPerRooms[key].length
    }
    reservationPerRooms = Object.keys(reservationPerRooms).sort((o1,o2) => reservationPerRooms[o1] - reservationPerRooms[o2])
    this.setState({
      totalReservations,
      mostActiveRoom: reservationPerRooms[reservationPerRooms.length-1],
      leastActiveRoom: reservationPerRooms[0],
      feedbackPerRooms
    })
  }
  render() {
    const feedbackPerRooms = this.state.feedbackPerRooms
    const roomFeedbacks = new Array(this.props.rooms.length)
    for (let roomFeedback in feedbackPerRooms) {
      roomFeedbacks[roomFeedback] =
        <li key={roomFeedback}>
          <p>{roomFeedback}. szoba: <strong>{feedbackPerRooms[roomFeedback].toFixed(2)}</strong></p>
        </li>
    }
    for (let i = 1; i < roomFeedbacks.length; i++) {
      if (!roomFeedbacks[i]) {
        roomFeedbacks[i] =
        <li key={i}>
          <p>{i}. szoba: Nincs értékelés</p>
        </li>
      }
    }
    return (
      <div id="stats-wrapper" className="posts-wrapper">
        <h3 className="posts-header">Statisztikák</h3>
        <ul id="stats">
          <li className="stat post">
            <div className="post-header">
              <p>Eddigi összes foglalás</p>
            </div>
            <div className="post-body">
              <p>{this.state.totalReservations}</p>
            </div>
          </li>
          <li className="stat post">
            <div className="post-header">
              <p>Legaktívabb szoba</p>
            </div>
            <div className="post-body">
              <p>{this.state.mostActiveRoom}</p>
            </div>
          </li>
          <li className="stat post">
            <div className="post-header">
              <p>Legkevésbé aktív szoba</p>
            </div>
            <div className="post-body">
              <p>{this.state.leastActiveRoom}</p>
            </div>
          </li>
          <li className="stat post">
            <div className="post-header">
              <p>Szobák átlagos értékelése (1-5):</p>
            </div>
            <div className="post-body">
              <ul>
                {roomFeedbacks}
              </ul>
            </div>
          </li>
        </ul>
      </div>
    )}
}
