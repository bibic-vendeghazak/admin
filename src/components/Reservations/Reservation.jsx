  import React from 'react'
  import firebase from 'firebase'
  import 'firebase/database'
  import {List, ListItem} from 'material-ui/List'
  import {ExpandableCard} from '../shared'
  import RaisedButton from 'material-ui/RaisedButton'
  import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
  } from 'material-ui/Table'
  import CommunicationCall from 'material-ui/svg-icons/communication/call'
  import Email from 'material-ui/svg-icons/communication/email'
  import Message from 'material-ui/svg-icons/communication/message'


  const Reservation = ({id, reservation}) => {

    const handleReservation = isAccepted => {
      firebase.database().ref(`reservations/metadata/${id}`).update({"handled": isAccepted})
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
      <ListItem disabled style={{padding: ".25em 4em"}}>
      <ExpandableCard
        title={`${name} - ${dayDiff(to, from)} nap`}
        subtitle={`Szoba ${roomId}`}
      > 
      <div>
        <h4>A foglaló adatai</h4>
        <List>
          <ListItem disabled leftIcon={<Email/>} primaryText={<a href={`mailto:${email}`}>{email}</a>} secondaryText="E-mail"/>
          <ListItem disabled leftIcon={<CommunicationCall/>} primaryText={<a href={`tel:${tel}`}>{tel}</a>} secondaryText="Telefonszám"/>
          <ListItem disabled leftIcon={<Message/>} primaryText={message ? message : "Nincs üzenet"} secondaryText="Üzenet"/>
        </List>
      <h4>A foglalás részletei</h4>
      <Table selectable={false}>
            <TableHeader 
              displaySelectAll={false}
              adjustForCheckbox={false}
              >
              <TableRow>
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
