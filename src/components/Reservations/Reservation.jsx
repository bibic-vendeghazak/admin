import React from 'react'
import firebase from 'firebase'
import 'firebase/database'
import {ListItem} from 'material-ui/List'
import {ExpandableCard} from '../shared'
import RaisedButton from 'material-ui/RaisedButton'
import {
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table'

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

  const dayDiff = (timestamp1, timestamp2) => {
    var difference = timestamp1 - timestamp2
    var daysDifference = Math.floor(difference/1000/60/60/24)
    return daysDifference
  }

  const {metadata, details} = reservation
  const {roomId, from, to, handled} = metadata
  const {name, email, tel, message, adults, children} = details
  return (
    <ListItem disabled style={{padding: 0}}>
    <ExpandableCard
      title={`${name} - ${dayDiff(to, from)} nap`}
      subtitle={`Szoba ${roomId}`}
    > 
    <div>
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
        

    <Table selectable={false}>
          <TableHeader 
            displaySelectAll={false}
            adjustForCheckbox={false}
            >
            <TableRow>
              <TableHeaderColumn colSpan="5" style={{textAlign: 'center'}}>
              <h4>A foglalás részletei</h4>
              </TableHeaderColumn>
            </TableRow>
            <TableRow>
              <TableHeaderColumn>Szobaszám</TableHeaderColumn>
              <TableHeaderColumn>Felnőtt</TableHeaderColumn>
              <TableHeaderColumn>Gyerek</TableHeaderColumn>
              <TableHeaderColumn>Érkezés</TableHeaderColumn>
              <TableHeaderColumn>Távozás</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            <TableRow>
              <TableRowColumn>{roomId}. szoba</TableRowColumn>
              <TableRowColumn>{adults} személy</TableRowColumn>
              <TableRowColumn>{children} személy</TableRowColumn>
              <TableRowColumn>{toDate(from)}</TableRowColumn>
              <TableRowColumn>{toDate(to)}</TableRowColumn>
            </TableRow>
          </TableBody>
    </Table>
    <div>
          {!handled &&
          <RaisedButton
            primary
            label="Elfogadás"
            onClick={() => handleReservation(true)}
            
          />
          }
          <RaisedButton
            secondary
            label={handled ? "Visszavon" :"Elutasítás"}
            onClick={() => handleReservation(false)}
          />
        </div>
    </div>
   
    </ExpandableCard>
  </ListItem>
    
  )
}

export default Reservation
