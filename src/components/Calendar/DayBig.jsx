import React from 'react'
import {Card, CardHeader} from 'material-ui/Card'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table'
import {List, ListItem} from 'material-ui/List'
import Close from 'material-ui/svg-icons/navigation/close'

// NOTE: DELETE THIS WHEN Room numbers are fixed
import firebase from 'firebase'
import 'firebase/database'
import moment from 'moment'

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


  return (
    <Card className="day-big">
      <FloatingActionButton className="day-big-close-btn" mini secondary onClick={() => handleClick()}>
        <Close/>
      </FloatingActionButton>
      <CardHeader title={`${months[month]} ${day}.`}/>
      <Table
      >
          <TableHeader
          displaySelectAll={false}
          adjustForCheckbox={false}
          >
            <TableRow>
              <TableHeaderColumn>Szoba</TableHeaderColumn>
              <TableHeaderColumn>Név</TableHeaderColumn>
              <TableHeaderColumn>E-mail</TableHeaderColumn>
              <TableHeaderColumn>Telefon</TableHeaderColumn>
              <TableHeaderColumn>Érkezés/Távozás</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            { reservationsData.map(reservation => {
            const [key,value] = reservation
            const {roomId, from, to} = value.metadata
            const {name, email, tel} = value.details
            return(
              <TableRow key={reservation}>
                <TableRowColumn className={`room-day-big room-${roomId}`}>Szoba {roomId}</TableRowColumn>
                <TableRowColumn>{name}</TableRowColumn>
                <TableRowColumn><a tooltip={email} href={`mailto:${email}`}>{email}</a></TableRowColumn>
                <TableRowColumn><a tooltip={tel} href={`tel:${tel}`}>{tel}</a></TableRowColumn>
                <TableRowColumn style={{textAlign: "right"}}>
                  <div>
                    <div>{moment(from).format('YYYY. MMMM DD.')}</div>
                    <div>{moment(to).format('YYYY. MMMM DD.')}</div>
                  </div>
                </TableRowColumn>
              </TableRow>
              )
            })}
          </TableBody>
        </Table>
    </Card>
  )
}

export default DayBig
