import React from 'react'

// NOTE: DELETE THIS WHEN Room numbers are fixed
import firebase from 'firebase'
import 'firebase/database'

const months = [
  "Január", "Február", "Március",
  "Április", "Május", "Június",
  "Július", "Augusztus", "Szeptember",
  "Október", "November", "December"
]
const DayBig = (props) => {

  const handleClick = () => {
    props.closeBigDay()
  }

  document.addEventListener("keydown", (e)=> {
      e.keyCode === 27 && props.closeBigDay()
  })



  // NOTE: DELETE THIS WHEN Room numbers are fixed
  const changeRoom = e => {
    const event = e.target
    const roomId = event.value
    const id = event.getAttribute('data-id')
    firebase.database().ref(`/reservations/metadata/${id}/roomId`).set(parseInt(roomId,10))
  }

  const deleteReservation = e => {
    const id = e.target.getAttribute('data-id')
    firebase.database().ref(`/reservations/metadata/${id}`).update({handled: false})
  }

  const {month, day} = props.date
  const reservationsData = Object.entries(props.reservations)
  reservationsData.sort((a,b) => a[1].metadata.roomId - b[1].metadata.roomId)
  let reservations = []
  reservationsData.forEach(reservation => {
    const [key,value] = reservation
    const {roomId, from, to} = value.metadata
    const {name, email, tel} = value.details

    reservations.push(
      <li key={key}>
        <input
          data-id={key}
          defaultValue={roomId}
          // NOTE: DELETE THIS WHEN Room numbers are fixed
          onChange={e => changeRoom(e)}
          className={`room-${roomId}`}
        />
        <div className="post-body day-big-wrapper">
          <div className="reservation-name">
            <p>
              Szoba {roomId}
            </p>
            <p>{name}</p>
          </div>
          <div className="reservation-email">
            <h4>E-mail: </h4>
            <a href={`mailto:${email}`}>{email}</a>
          </div>
          <div className="reservation-tel">
            <h4>Telefonszám: </h4>
            <a href={`tel:${tel}`}>{tel}</a>
          </div>
          <div className="reservation-room">
            <div className="reservation-date">
              <h5>Érkezés:</h5>
              <date>{new Date(from).toISOString().slice(0,10)}</date>
            </div>
            <div className="reservation-date">
              <h5>Távozás:</h5>
              <date>{new Date(to).toISOString().slice(0,10)}</date>
            </div>
          </div>
          <span
            data-id={key}
            onClick={e => deleteReservation(e)}
            className="red-btn"
            style={{position: "static"}}
          >✗</span>
        </div>
      </li>
    )
  })

  return (
    <div className="day-big">
      <div className="post-header">
        <p>{months[month]}</p>
        <p>{day}</p>
      </div>
      <ul>
        {reservations}
      </ul>
      <span className="red-btn" onClick={() => handleClick()}>✗</span>
    </div>
  )
}

export default DayBig
