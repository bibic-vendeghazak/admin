import React from 'react'
import firebase from 'firebase'
import 'firebase/database'

const Reservation = ({id, reservation}) => {

  const handleReservation = isAccepted => {
    firebase.database().ref(`reservations/metadata/${id}`).update({"handled": isAccepted})
  }

  const handleClick = event => {
    const e = event.target
    e.parentNode.parentNode.children[1].classList.toggle("hidden")
    e.classList.toggle("rotated")
  }
  const toDate = date => {
    return new Date(date).toISOString().slice(0,10)
  }

  const {metadata, details} = reservation
  const {roomId, from, to, handled} = metadata
  const {name, email, tel, message, adults, children} = details
  return (
    <li className="reservation post">
      <div className={`post-header ${handled && "post-handled"}`}>
        <div className="reservation-name">
          <p>{name}</p>
          <span> - Szoba {roomId}</span>
        </div>
        <span
          className="post-toggle"
          onClick={e => handleClick(e)}
        >▼</span>
      </div>
      <div className="post-body hidden">
        <div className="reservation-email">
          <h4>E-mail: </h4>
          <a href={`mailto:${email}`}>{email}</a>
        </div>
        <div className="reservation-tel">
          <h4>Telefonszám: </h4>
          <a href={`tel:${tel}`}>{tel}</a>
        </div>
        <div className="reservation-message">
          <h4>Üzenet: </h4>
          <p>{message ? message : "Nincs üzenet"}</p>
        </div>
        <div className="reservation-room">
          <h4>Szoba adatok:</h4>
          <div className="reservation-room-number">
            <h5>Szobaszám: </h5>
            <p>{roomId}. szoba</p>
          </div>
          <div className="reservation-person">
            <h5>Felnőtt: </h5>
            <p>{adults} személy</p>
          </div>
          <div className="reservation-person">
            <h5>Gyerek: </h5>
            <p>{children ? `${children} személy` : "0"}</p>
          </div>
          <div className="reservation-date">
            <h5>Érkezés:</h5>
            <date>{toDate(from)}</date>
          </div>
          <div className="reservation-date">
            <h5>Távozás:</h5>
            <date>{toDate(to)}</date>
          </div>
        </div>
        <div className="reservation-handled post-handle">
          <span
            className="accept-reservation green-btn"
            onClick={() => handleReservation(true)}
          >✓</span>
          <span
            className="reject-reservation red-btn"
            onClick={() => handleReservation(false)}
          >✗</span>
        </div>

      </div>
    </li>
  )
}

export default Reservation
