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
import IconButton from 'material-ui/IconButton'
import DatePicker from 'material-ui/DatePicker'
import Edit from 'material-ui/svg-icons/image/edit'
import Done from 'material-ui/svg-icons/action/done'

import CommunicationCall from 'material-ui/svg-icons/communication/call'
import Email from 'material-ui/svg-icons/communication/email'
import Message from 'material-ui/svg-icons/communication/message'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import Subheader from 'material-ui/Subheader'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField/TextField';

export default class Reservation extends Component {
  constructor(props) {
    super(props)
    const {details: {adults, children}, metadata: {roomId, from, to}} = props.reservation
    this.state = {
      isDeleteDialogOpen: false,
      isEditingDialogOpen: false,
      name: "",
      newRoomId: roomId,
      newAdults: adults,
      newChildren: children,
      newFrom: from,
      newTo: to
    }
  }

  handleReservation = isHandled => {
    const reservationRef = firebase.database().ref(`reservations/${this.props.id}`)
    reservationRef.child('metadata/handled').set(isHandled)
    reservationRef.child('lastHandledBy').set(firebase.auth().currentUser.uid)
  }

  handleOpenEditingDialog = () => this.setState({isEditingDialogOpen: true})
  handleCloseEditingDialog = () => this.setState({isEditingDialogOpen: false})
  handleSubmitEditingDialog = () => this.setState({isEditingDialogOpen: false})

  componentDidMount() {
    const db = firebase.database()
    db.ref(`reservations/${this.props.id}/lastHandledBy`).on('value', snap => {
      db.ref(`admins/${snap.val()}`).on("value", snap => snap.val() && this.setState({name: snap.val().name}))
    })
  }


  openDeleteReservationDialog = () => this.setState({isDeleteDialogOpen: true})
  closeDeleteReservationDialog = () => this.setState({isDeleteDialogOpen: false})

  deleteReservation = () => {
    firebase.database().ref(`reservations/${this.props.id}`).remove()
  }


  render() {
    const {details: {name, email, tel, message, adults, children}, metadata: {roomId, from, to, handled}, timestamp} = this.props.reservation
    const {isDeleteDialogOpen, name: adminName, isEditingDialogOpen, newRoomId, newAdults, newChildren, newFrom, newTo} = this.state
      
    return (
      <ListItem disabled style={{padding: ".25em 5vw"}}>
      <ExpandableCard
        title={`${name} (${moment(to).diff(moment(from), "days")} nap)`}
        subtitle={`Szoba ${roomId}`}
      > 
      <div>
        <Subheader>A foglaló adatai</Subheader>
        <List style={{display: "flex", flexWrap: "wrap"}}>
          <ListItem disabled leftIcon={<Email/>} primaryText={<a href={`mailto:${email}`}>{email}</a>} secondaryText="E-mail"/>
          <ListItem disabled leftIcon={<CommunicationCall/>} primaryText={<a href={`tel:${tel}`}>{tel}</a>} secondaryText="Telefonszám"/>
          <ListItem disabled leftIcon={<Message/>} primaryText={message ? message : "Nincs üzenet"} secondaryText="Üzenet"/>
        </List>
      <Subheader>A foglalás részletei</Subheader>
      <Dialog 
        title="Foglalás módosítása"
        open={isEditingDialogOpen}
        modal
        actions={[
          <RaisedButton style={{marginRight: 12}} onClick={() => this.handleCloseEditingDialog()} label="Mégse"/>,
          <RaisedButton onClick={() => this.handleSubmitEditingDialog()} secondary label="Mentés"/>
        ]}  
      >
        <TextField
          id="Szoba"
          type="number"
          value={newRoomId}
        />
        <TextField
          id="Felnőtt"
          type="number"
          value={newAdults}
        />
        <TextField
          id="Gyerek"
          type="number"
          value={newChildren}
        />
        <DatePicker
          defaultDate={new Date(newFrom)}
        />
        <DatePicker
          defaultDate={new Date(newTo)}
        />
      </Dialog>
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
                <IconButton onClick={() => isEditingDialogOpen ? this.handleCloseEditingDialog(): this.handleOpenEditingDialog()}>
                  {isEditingDialogOpen ? <Done/> : <Edit/>}
                </IconButton>
              </TableRowColumn>
              </TableRow>
            </TableBody>
      </Table>
      <p style={{margin: 12, textAlign: "center"}}>Foglalást utoljára kezelte: {adminName === "" ? "Még senki": adminName}</p>
      <div style={{display: "flex", flexWrap: "wrap", justifyContent: "space-evenly", alignItems: "flex-end"}}>
            <div style={{display: window.innerWidth <= 768 && "flex", flexGrow: 1, justifyContent: "space-between"}}>
            {!handled &&
              <RaisedButton
                style={{marginRight: 12}}
                primary
                label="Elfogadás"
                onClick={() => this.handleReservation(true)}
              />}
              <RaisedButton
                secondary
                label={handled ? "Visszavon" : "Törlés"}
                onClick={() => handled ? this.handleReservation(false) : this.openDeleteReservationDialog()}
              />
            </div>
            <p style={{marginTop: "1em", color: "#ccc", fontSize: ".8em", fontStyle: "italic"}}>Foglalás dátuma: {moment(timestamp).format("YYYY. MMMM DD. HH:mm")}</p>
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