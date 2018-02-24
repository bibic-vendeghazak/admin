import React, {Component} from 'react'
import firebase from 'firebase'
import moment from 'moment'

import {List, ListItem} from 'material-ui/List'
import {
  Table,
  TableBody,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table'
import IconButton from 'material-ui/IconButton'
import DatePicker from 'material-ui/DatePicker'
import Subheader from 'material-ui/Subheader'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField/TextField'

import Edit from 'material-ui/svg-icons/image/edit'
import Done from 'material-ui/svg-icons/action/done'
import Delete from 'material-ui/svg-icons/action/delete'
import Reject from 'material-ui/svg-icons/content/redo'
import Tel from 'material-ui/svg-icons/communication/call'
import Email from 'material-ui/svg-icons/communication/email'
import Message from 'material-ui/svg-icons/communication/message'


import {Post, ModalDialog} from '../../shared'

export default class Reservation extends Component {
  
  constructor(props) {
    super(props)
    const {
      details: {adults, children},
      metadata: {roomId, from, to}
    } = props.reservation
    
    this.state = {
      isDeleting: false,
      isEditing: false,
      adminName: "Még senki",
      roomId,
      adults, children,
      from,to
    }
  }

  handleReservation = isHandled => {
    const reservationRef = firebase.database().ref(`reservations/${this.props.id}`)
    reservationRef.child('metadata/handled').set(isHandled)
    reservationRef.child('lastHandledBy').set(firebase.auth().currentUser.uid)
  }

  openEditReservation = () => this.setState({isEditing: true})
  closeEditReservation = () => this.setState({isEditing: false})
  // NOTE: add submit functionality
  saveReservationChanges = () => this.setState({isEditing: false})

  openDeleteReservation = () => this.setState({isDeleting: true})
  closeDeleteReservation = () => this.setState({isDeleting: false})
  deleteReservation = () => firebase.database().ref(`reservations/${this.props.id}`).remove()

  componentDidMount() {
    const db = firebase.database()
    db.ref(`reservations/${this.props.id}/lastHandledBy`).on('value', snap => {
      db.ref(`admins/${snap.val()}`)
        .on("value", snap => {
          this.setState({
            adminName: snap.val() ? snap.val().name : "Még senki"
          })
        })
    })
  }


  render() {
    const {
      details: {name, email, tel, message}, 
      metadata: {handled}, timestamp
    } = this.props.reservation

    const {
      isDeleting, adminName, isEditing,
      roomId, adults, children, from, to
    } = this.state
  
    return (
      <ListItem disabled style={{padding: ".25em 5vw"}}>
        <Post
          title={`${name} (${moment(to).diff(moment(from), "days")} nap)`}
          subtitle={`Szoba ${roomId}`}
        >
          <Subheader>A foglaló adatai</Subheader>
          <List style={{display: "flex", flexWrap: "wrap"}}>
            <ListItem disabled
              leftIcon={<Email/>}
              primaryText={<a href={`mailto:${email}`}>{email}</a>} 
              secondaryText="E-mail"
            />
            <ListItem disabled
              leftIcon={<Tel/>}
              primaryText={<a href={`tel:${tel}`}>{tel}</a>} 
              secondaryText="Telefonszám"
            />
            <ListItem disabled
              leftIcon={<Message/>}
              primaryText={message} 
              secondaryText="Üzenet"
            />
          </List>
          <Subheader>A foglalás részletei</Subheader>
          <ModalDialog
            title="Foglalás módosítása"
            open={isEditing}
            submitLabel="Mentés"
            onCancel={this.closeEditReservation}
            onSubmit={this.saveReservationChanges}
          >
            <TextField
              id="Szoba"
              type="number"
              value={roomId}
            />
            <TextField
              id="Felnőtt"
              type="number"
              value={adults}
            />
            <TextField
              id="Gyerek"
              type="number"
              value={children}
            />
            <DatePicker
              defaultDate={new Date(from)}
            />
            <DatePicker
              defaultDate={new Date(to)}
            />
          </ModalDialog>
          <Table
            bodyStyle={{
              overflowX:'visible',
              minWidth: 640
            }} 
            selectable={false}
          >
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
                <IconButton onClick={() => isEditing ? this.closeEditReservation(): this.openEditReservation()}>
                  {isEditing ? <Done/> : <Edit/>}
                </IconButton>
              </TableRowColumn>
              </TableRow>
            </TableBody>
          </Table>
          <p style={{margin: 12, textAlign: "center"}}>Foglalást utoljára kezelte: {adminName}</p>
          <div style={{display: "flex", flexWrap: "wrap", justifyContent: "space-evenly", alignItems: "flex-end"}}>
            <div style={{display: window.innerWidth <= 768 && "flex", flexGrow: 1, justifyContent: "space-between"}}>
              {!handled &&
                <RaisedButton
                  style={{marginRight: 12}}
                  primary
                  label="Elfogad"
                  icon={<Done/>}
                  labelPosition="before"
                  onClick={() => this.handleReservation(true)}
                />
              }
              <RaisedButton
                secondary
                label={handled ? "Visszavon" : "Törlés"}
                icon={handled ? <Reject/> : <Delete/>}
                labelPosition="before"
                onClick={() => handled ? this.handleReservation(false) : this.openDeleteReservation()}
              />
            </div>
            <p style={{marginTop: "1em", color: "#ccc", fontSize: ".8em", fontStyle: "italic"}}>Foglalás dátuma: {moment(timestamp).format("YYYY. MMMM DD. HH:mm")}</p>
            <ModalDialog
              title="Foglalás végleges törlése"
              open={isDeleting}
              onCancel={this.closeDeleteReservation}
              onSubmit={this.deleteReservation}
              children="Biztosan törölni szeretné ezt a foglalást? A folyamat nem visszafordítható!"
            />
          </div>
        </Post>
      </ListItem>
    )
  }
}