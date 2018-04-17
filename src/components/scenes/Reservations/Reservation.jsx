import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import firebase from 'firebase'
import moment from 'moment'
import {Link, withRouter} from 'react-router-dom'

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

class Reservation extends Component {
  
  state = {
    isDeleting: false,
    adminName: "Még senki",
    reservation: {
      name: null,
      email: null,
      tel: null,
      message: null,
      adults: null,
      children: null,
      roomId: null,
      from: null,
      to: null,
      handled: null,
      timestamp: null
    }
  }


  handleReservation = isHandled => {
    const reservationRef = firebase.database().ref(`reservations/${this.props.id}`)
    reservationRef.child('handled').set(isHandled)
    reservationRef.child('lastHandledBy').set(firebase.auth().currentUser.uid)
  }

  openDeleteReservation = () => this.setState({isDeleting: true})
  closeDeleteReservation = () => this.setState({isDeleting: false})
  deleteReservation = () => firebase.database().ref(`reservations/${this.props.id}`).remove()

  componentDidMount() {
    const db = firebase.database()
    db.ref(`reservations/${this.props.id}`).on('value', snap => {
      this.setState({
        reservation: snap.val()
      })

      if (snap.val().lastHandledBy) {
        db.ref(`admins/${snap.val().lastHandledBy}`)
          .once("value").then(snap => {
            this.setState({
              adminName: snap.val().name
            })
          })
      }
    })

  }


  render() {
    const {
      id,
      match
    } = this.props
    
    const {
      isDeleting, adminName,
      reservation: {
        name, email, tel, message, adults, children, 
        roomId, from, to, handled,
        timestamp
      }
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
                <TableRowColumn>{(children || []).length} személy</TableRowColumn>
                <TableRowColumn>{moment(from).format('MMMM D. HH:mm')}</TableRowColumn>
                <TableRowColumn>{moment(to).format('MMMM D. HH:mm')}</TableRowColumn>
                <TableRowColumn colSpan={1} style={{textAlign: "center"}}>
                <IconButton>
                  <Link to={`${match.url}/${id}/szerkeszt`}><Edit/></Link>
                </IconButton>
              </TableRowColumn>
              </TableRow>
            </TableBody>
          </Table>
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
            <p style={{marginTop: "1em", color: "#ccc", fontSize: ".8em", fontStyle: "italic"}}>{adminName === "Még senki" ? "Foglalás dátuma" : `Utolsó módosítás (${adminName})`}: {moment(timestamp).format("YYYY. MMMM DD. HH:mm:SS")}</p>
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


export default withRouter(Reservation)




class EditReservation extends Component {

  state = {
    children: null,
    adults: null,
    lastHandledBy: null,
    from: null,
    to: null,
    roomId: null
  }

  componentDidMount() {
    const {reservationId} = this.props.match.params
    firebase.database()
      .ref(`reservations/${reservationId}`)
      .once("value")
      .then(snap => {
        this.setState({
          ...snap.val(),
          reservationId
        })
      })
  }

  handleClose = () => {
    this.props.history.push(this.props.match.path.split("/:")[0])
  }

  handleSubmit = () => {
    const newReservation = Object.assign({}, this.state)
    delete newReservation.reservationId
    newReservation.timestamp = firebase.database.ServerValue.TIMESTAMP
    firebase.database().ref(`reservations/${this.state.reservationId}`)
      .set(newReservation)
      .then(() => this.handleClose())
  }

  handleMetadataTextChange = ({target: {name, value, type}}) => {
    this.setState({
      ...this.state,
      [name]: type === "number" && value ? parseInt(value, 10) : value
    })
  }

  handleDateChange = (date, type) => {
    this.setState({
      ...this.state,
      [type]: moment(date).set("hours", type === "from" ?  14 : 10).unix() * 1000,
      lastHandledBy: firebase.auth().currentUser.uid
    })
  }

  render() {
    const {children, adults, from, to, roomId} = this.state
    
    return ReactDOM.createPortal(
      <ModalDialog
        title="Foglalás módosítása"
        open
        submitLabel="Mentés"
        onCancel={this.handleClose}
        onSubmit={this.handleSubmit}
    >
      {roomId !== null &&
      <TextField
        onChange={this.handleMetadataTextChange}
        floatingLabelText="Szoba"
        id="roomId"
        name="roomId"
        type="number"
        value={roomId}
      />
      }
      <div>
        {adults !== null &&
          <TextField
            floatingLabelText="Felnőtt"
            id="adults"
            type="number"
            value={adults}
            />
          }
        {children !== null &&
          <TextField
            floatingLabelText="Gyerek"
            id="children"
            type="number"
            value={children}
            />
          }
      </div>
      <div 
        style={{display: "flex"}}
        >
        {from &&
          <DatePicker
            autoOk
            onChange={(e, date) => this.handleDateChange(date, "from")}
            floatingLabelText="Érkezés"
            id="from"
            defaultDate={new Date(from)}
            />
          }
        {to &&
          <DatePicker
            autoOk
            onChange={(e, date) => this.handleDateChange(date, "to")}
            floatingLabelText="Távozás"
            id="to"
            defaultDate={new Date(to)}
          />
        }
      </div>
    </ModalDialog>, document.querySelector(".modal-root"))
  }
}


export {EditReservation}