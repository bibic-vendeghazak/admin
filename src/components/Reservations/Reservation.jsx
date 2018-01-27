import React, {Component} from 'react'
import firebase from 'firebase'
import moment from 'moment'
import {List, ListItem} from 'material-ui/List'
import {ExpandableCard} from '../shared'
import {
  Table,
  TableBody,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table'
import FontIcon from 'material-ui/FontIcon'
import Edit from 'material-ui/svg-icons/image/edit'
import CommunicationCall from 'material-ui/svg-icons/communication/call'
import Email from 'material-ui/svg-icons/communication/email'
import Message from 'material-ui/svg-icons/communication/message'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'


export default class Reservation extends Component {

  state= {
    isDeleteDialogOpen: false
  }

  handleReservation = isHandled => {
    firebase.database().ref(`reservations/${this.props.id}/metadata/handled`).set(isHandled)
  }


  openDeleteReservationDialog = () => this.setState({isDeleteDialogOpen: true})
  closeDeleteReservationDialog = () => this.setState({isDeleteDialogOpen: false})

  deleteReservation = () => {
    firebase.database().ref(`reservations/${this.props.id}`).remove()
  }


  render() {
    const {details: {name, email, tel, message, adults, children}, metadata: {roomId, from, to, handled}} = this.props.reservation
    const {isDeleteDialogOpen} = this.state
    return (
      <ListItem disabled style={{padding: ".25em 5vw"}}>
      <ExpandableCard
        title={`${name} (${moment(to).diff(moment(from), "days")} nap)`}
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
              onClick={() => this.handleReservation(true)}
            />
            }
            <RaisedButton
              secondary
              label={handled ? "Visszavon" : "Törlés"}
              onClick={() => handled ? this.handleReservation(false) : this.openDeleteReservationDialog()}
            />
              <Dialog
                title="Foglalás végleges törlése"
                actions={[
                  <FlatButton
                    label="Mégse"
                    primary
                    onClick={this.closeDeleteReservationDialog}
                  />,
                  <RaisedButton
                    label="Végleges törlés"
                    secondary
                    onClick={this.deleteReservation}
                  />,
                ]}
                modal
                open={isDeleteDialogOpen}
              >
              Biztos törölni szeretné ezt a foglalást? A folyamat nem visszafordítható!
            </Dialog>
          </div>
      </div>
      </ExpandableCard>
    </ListItem>
    )
    
  }

}