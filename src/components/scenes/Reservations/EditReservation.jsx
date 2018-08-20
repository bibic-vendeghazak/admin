import React, {Component, Fragment} from "react"
import moment from "moment"

import {RESERVATIONS_FS, TIMESTAMP, AUTH, getAdminName} from "../../../utils/firebase"

import {Switch, Grid, TextField, FormControlLabel, InputAdornment, Select, MenuItem, FormControl, InputLabel, Input, Tooltip} from '@material-ui/core'

import Autorenew from '@material-ui/icons/AutorenewRounded'

import {Modal} from "../../shared"
import {isValidReservation} from "../../../utils"

export default class EditReservation extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isFullReservation: props.isFullReservation,
      reservation: {
        message: "🤖 admin által felvéve",
        name: "",
        roomId: 1,
        tel: "000-000-000",
        email: "email@email.hu",
        address: "lakcím",
        adults: 1,
        children: [
          {
            name: "0-6",
            count: 0
          }, {
            name: "6-12",
            count: 0
          }
        ],
        from: moment().startOf("day").hours(14).toDate(),
        to: moment().startOf("day").hours(10).add(1, "day").toDate(),
        handled: true,
        activeService: "breakfast",
        price: 1
      },
      priceError: null
    }
  }

  componentDidMount() {
    getAdminName(AUTH.currentUser.uid)
      .then(admin => this.setState({admin: admin.val()}))


    RESERVATIONS_FS.doc(this.props.match.params.reservationId || "newReservation")
      .get()
      .then(snap => {
        if (snap.exists) {
          const {
            from, to
          } = snap.data()
          this.setState({reservation: {
            ...snap.data(),
            from: from.toDate(),
            to: to.toDate()
          }})
        }
      })
      .catch(this.props.sendNotification)

  }

  handleInputChange = ({target: {
    name, value, type
  }}) => {
    this.setState(({reservation}) => ({reservation: {
      ...reservation,
      [name]: type === "number" ? parseInt(value, 10) : value
    }}), () => name!=="price" && this.handleGetPrice())
  }

  handleChildrenChange = ({target: {value}}, type) => {
    const {children} = this.state.reservation
    children[type].count = parseInt(value, 10) || 0
    this.setState(({reservation}) => ({reservation: {
      ...reservation,
      children
    }}), this.handleGetPrice)
  }

  handleDateChange = ({target: {
    name, value
  }}) => {
    let from,to
    switch (name) {
    case "from":
      from = moment(value).startOf("day").hours(14).toDate()
      break
    default:
      to = moment(value).startOf("day").hours(10).toDate()
    }
    this.setState(({reservation}) => ({reservation: {
      ...reservation,
      from: from || reservation.from,
      to: to || reservation.to
    }}), this.handleGetPrice)
  }

  handleSubmit = () => {
    const {
      reservation, admin
    } = this.state
    const {
      rooms, match: {params: {reservationId}}
    } = this.props

    const newReservation = {
      ...reservation,
      timestamp: TIMESTAMP,
      id: `${moment(reservation.from).format("YYYYMMDD")}-sz${reservation.roomId}`,
      lastHandledBy: admin
    }

    const reservationStatus = isValidReservation(newReservation, rooms.length)
    return reservationStatus === "OK" ?
      reservationId ?
        RESERVATIONS_FS.doc(reservationId).set(newReservation) :
        RESERVATIONS_FS.add(newReservation) :
      Promise.reject({
        code: "error",
        message: `Érvénytelen ${reservationStatus}!`
      })
  }

  handleComplexityChange = () =>
    this.setState(
      ({isFullReservation}) => ({isFullReservation: !isFullReservation})
    )


  handleGetPrice = () => {
    const {
      from, to, roomId, adults, children, activeService
    } = this.state.reservation
    const {rooms} = this.props
    if (rooms.length) {
      const roomPrice = rooms[roomId-1].prices.table[activeService]
      console.log(roomPrice)
      let price = 0
      let priceError = "Egyedi árazás szükséges"
      if(roomPrice.hasOwnProperty(adults)) {
        const periodLength = moment(to).diff(moment(from), "days")+1
        const tempPrice = roomPrice[adults]
        const childCount = children[1] ? children[1].count : 0
        if(tempPrice.hasOwnProperty(childCount)) {
          price = tempPrice[childCount].price * periodLength
          priceError = null
        }
      }
      this.setState(({reservation}) => ({
        priceError,
        reservation: {
          ...reservation,
          price
        }
      }))
    }
  }

  render() {
    const {
      isFullReservation, priceError, reservation: {
        name, tel, email,
        roomId, adults, children,
        from, to, message, address, price, activeService
      }
    } = this.state
    const {
      error, submitLabel, success, successPath,
      title, shouldPrompt, promptTitle, rooms
    } = this.props
    return (
      <Modal
        onSubmit={this.handleSubmit}
        {...{
          error,
          submitLabel,
          success,
          successPath,
          shouldPrompt,
          promptTitle
        }}
        title={
          <Grid
            alignItems="center"
            container
            justify="space-between"
          >
            {title}
            {!this.props.isFullReservation &&
              <FormControlLabel
                control={
                  <Switch
                    checked={isFullReservation}
                    onChange={this.handleComplexityChange}
                    value="complexity-change"
                  />
                }
                label={isFullReservation ? "Részletes" : "Egyszerű"}
              />
            }
          </Grid>
        }
      >
        <Grid
          container
          justify="space-between"
        >
          <Grid
            item
            sm={5}
            xs={12}
          >
            <TextField
              fullWidth
              label="Érkezés"
              margin="normal"
              name="from"
              onChange={this.handleDateChange}
              required
              type="date"
              value={moment(from).format("YYYY-MM-DD")}
            />
          </Grid>
          <Grid
            item
            sm={5}
            xs={12}
          >
            <TextField
              fullWidth
              label="Távozás"
              margin="normal"
              name="to"
              onChange={this.handleDateChange}
              required
              type="date"
              value={moment(to).format("YYYY-MM-DD")}
            />
          </Grid>
        </Grid>
        <Grid
          alignItems="baseline"
          container
          justify="space-between"
        >
          <Grid
            item
            xs={6}
          >
            <TextField
              autoComplete="name"
              fullWidth
              label="Név"
              margin="normal"
              name="name"
              onChange={this.handleInputChange}
              required
              value={name}
            />
          </Grid>
          <Grid
            container
            item
            justify="flex-end"
            xs={5}
          >
            <FormControl>
              <InputLabel
                htmlFor="roomId"
                required
                shrink
              >
                Szoba
              </InputLabel>
              <Select
                input={<Input name="roomId"/>}
                name="roomId"
                onChange={this.handleInputChange}
                required
                value={roomId || 1}
              >
                <MenuItem value={1}>Szoba 1</MenuItem>
                {Array((rooms.length || 1)-1)
                  .fill(null)
                  .map((e, i) =>
                    <MenuItem
                      key={i}
                      value={i+2}
                    >
                    Szoba {i+2}
                    </MenuItem>
                  )
                }
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        {isFullReservation &&
           <Fragment>
             <Grid
               container
               spacing={16}
             >
               <Grid
                 item
                 sm={5}
                 xs
               >
                 <TextField
                   autoComplete="email"
                   fullWidth
                   label="E-mail cím"
                   margin="normal"
                   name="email"
                   onChange={this.handleInputChange}
                   type="email"
                   value={email}
                 />
               </Grid>
               <Grid
                 item
                 sm={5}
                 xs
               >
                 <TextField
                   autoComplete="tel"
                   fullWidth
                   label="Telefonszám"
                   margin="normal"
                   name="tel"
                   onChange={this.handleInputChange}
                   type="tel"
                   value={tel}
                 />
               </Grid>
               <TextField
                 fullWidth
                 label="Lakcím"
                 margin="normal"
                 name="address"
                 onChange={this.handleInputChange}
                 value={address}
               />

             </Grid>
             <Grid
               alignItems="baseline"
               container
               spacing={16}
             >
               <Grid
                 item
                 sm={3}
                 xs={5}
               >
                 <TextField
                   InputProps={{endAdornment: <InputAdornment>fő</InputAdornment>}}
                   fullWidth
                   label="Felnőtt"
                   name="adults"
                   onChange={this.handleInputChange}
                   type="number"
                   value={adults || ""}
                 />
               </Grid>
               {children.map(({
                 name, count
               }, index) =>
                 <Grid
                   item
                   key={index}
                   sm={3}
                   xs={5}
                 >
                   <TextField
                     InputProps={{endAdornment: <InputAdornment>fő</InputAdornment>}}
                     fullWidth
                     label={`Gyerek (${name})`}
                     onChange={e => this.handleChildrenChange(e, index)}
                     type="number"
                     value={count || ""}
                   />
                 </Grid>
               )}

               <Grid
                 item
                 sm={4}
                 xs={6}
               >
                 <TextField
                   InputProps={{
                     startAdornment: <InputAdornment position="start">HUF</InputAdornment>,
                     endAdornment:
                     <InputAdornment>
                       <Tooltip title="Automatikus árazás">
                         <Autorenew color="disabled"/>
                       </Tooltip>
                     </InputAdornment>
                   }}
                   error={Boolean(priceError)}
                   fullWidth
                   label={priceError || "Ár"}
                   margin="normal"
                   name="price"
                   onChange={this.handleInputChange}
                   type="number"
                   value={price || ""}
                 />
               </Grid>
               <Grid
                 item
                 sm={4}
                 xs={5}
               >
                 <FormControl>
                   <InputLabel htmlFor="service">
                    Ellátás
                   </InputLabel>
                   <Select
                     input={
                       <Input
                         id="service"
                         name="activeService"
                       />
                     }
                     name="activeService"
                     onChange={this.handleInputChange}
                     value={activeService}
                   >
                     <MenuItem value="breakfast">reggeli</MenuItem>
                     <MenuItem value="halfBoard">félpanzió</MenuItem>
                   </Select>
                 </FormControl>
               </Grid>
               <TextField
                 fullWidth
                 label="Megjegyzés"
                 margin="normal"
                 multiline
                 name="message"
                 onChange={this.handleInputChange}
                 rows={4}
                 value={message}
               />
             </Grid>
           </Fragment>}
      </Modal>
    )
  }
}