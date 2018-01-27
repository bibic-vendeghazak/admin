  import React from 'react'
  import firebase from 'firebase'
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



  const Reservation = ({id, reservation: {details: {name, email, tel, message, adults, children}, metadata: {roomId, from, to, handled}}}) => {

    const handleReservation = isAccepted => {
      firebase.database().ref(`reservations/${id}/metadata`).update({"handled": isAccepted})
    }

    const toDate = date => {
      return new Date(date).toISOString().slice(0,10)
    }

    const dayDiff = (timestamp1, timestamp2) => {
      var difference = timestamp1 - timestamp2
      var daysDifference = Math.floor(difference/1000/60/60/24)
      return daysDifference
    }



    return (
      <ListItem disabled style={{padding: ".25em 4em"}}>
      <ExpandableCard
        title={`${name} - ${dayDiff(to, from)} nap`}
        subtitle={`Szoba ${roomId}`}
      > 
      <div>
        <h4>A foglaló adatai</h4>
        <List style={{display: "flex", flexWrap: "wrap"}}>
          <ListItem disabled leftIcon={<Email/>} primaryText={<a href={`mailto:${email}`}>{email}</a>} secondaryText="E-mail"/>
          <ListItem disabled leftIcon={<CommunicationCall/>} primaryText={<a href={`tel:${tel}`}>{tel}</a>} secondaryText="Telefonszám"/>
          <ListItem disabled leftIcon={<Message/>} primaryText={message ? message : "Nincs üzenet"} secondaryText="Üzenet"/>
        </List>
      <h4>A foglalás részletei</h4>
      <Table selectable={false}>
            <TableBody displayRowCheckbox={false}>
              <TableRow>
                <TableHeaderColumn>Szobaszám</TableHeaderColumn>
                <TableHeaderColumn>Felnőtt</TableHeaderColumn>
                <TableHeaderColumn>Gyerek</TableHeaderColumn>
                <TableHeaderColumn>Érkezés</TableHeaderColumn>
                <TableHeaderColumn>Távozás</TableHeaderColumn>
                <TableHeaderColumn colSpan={1} style={{textAlign: "center"}}>Szerkeszt</TableHeaderColumn>

              </TableRow>
              <TableRow>
                <TableRowColumn>{roomId}. szoba</TableRowColumn>
                <TableRowColumn>{adults} személy</TableRowColumn>
                <TableRowColumn>{children} személy</TableRowColumn>
                <TableRowColumn>{moment(from).format('MMMM D.')}</TableRowColumn>
                <TableRowColumn>{moment(to).format('MMMM D.')}</TableRowColumn>
                <TableRowColumn colSpan={1} style={{textAlign: "center"}}>
                <FontIcon>
                  <Edit/>
                </FontIcon>
              </TableRowColumn>
              </TableRow>
            </TableBody>
      </Table>
      <div>
            {!handled &&
            <RaisedButton
              style={{marginRight: 12}}
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
