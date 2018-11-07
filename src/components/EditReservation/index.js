import React, {Component} from "react"
import {moment} from "../../lib"

import {RESERVATIONS_FS} from "../../lib/firebase"

import {Switch, Grid, TextField, FormControlLabel} from '@material-ui/core'


import {Modal} from "../shared"
import {withStore} from "../../db"
import Children from "./Children"
import Adults from "./Adults"
import Price from "./Price"
import FoodService from "./FoodService"
import Message from "./Message"
import Email from "./Email"
import {TODAY, TOMORROW} from "../../lib/moment"
import Name from "./Name"
import RoomSelector from "./RoomSelector"
import Tel from "./Tel"
import Address from "./Address"
import {getPrice, handleSubmit} from "./functions"

class EditReservation extends Component {

  state = {
    fullReservation: false,
    reservation: {
      message: "🤖 admin által felvéve",
      name: "",
      roomId: 1,
      tel: "000-000-000",
      email: "email@email.hu",
      address: "lakcím",
      adults: 1,
      children: [
        {name: "0-6", count: 0},
        {name: "6-12", count: 0}
      ],
      from: TODAY.clone().hours(14),
      to: TOMORROW.clone().hours(10),
      handled: true,
      foodService: "breakfast",
      price: 1
    },
    priceError: null
  }

  componentDidMount = async () => {
    const {match: {params: {reservationId}}, fullReservation} = this.props
    this.setState({fullReservation})
    try {
      const reservation = await RESERVATIONS_FS.doc(reservationId || "non-existent").get()

      if (reservation.exists) {
        this.setState({reservation: reservation.data()})
      }

    } catch (error) {
      this.props.sendNotification(error)
    }

  }

  handleChange = (name, value, shouldUpdatePrice) =>
    this.setState(({reservation}) => ({reservation: {...reservation, [name]: value}}),
      () => shouldUpdatePrice && this.updatePrice()
    )

  handleDateChange = ({target: {name, value}}) => {
    let from,to
    switch (name) {
    case "from":
      from = moment(value).startOf("day").hours(14)
      break
    default:
      to = moment(value).startOf("day").hours(10)
    }
    this.setState(({reservation}) => ({reservation: {
      ...reservation,
      from: from || reservation.from,
      to: to || reservation.to
    }}), this.updatePrice)
  }


  handleComplexityChange = () =>
    this.setState(
      ({fullReservation}) => ({fullReservation: !fullReservation})
    )

  updatePrice = () => {
    const {error, price} = getPrice(this.state.reservation, this.props.rooms)
    this.setState(({reservation}) => ({
      priceError: error,
      reservation: {...reservation, price}})
    )
  }

  render() {
    const {
      fullReservation, priceError, reservation: {
        name, tel, email,
        roomId, adults, children,
        from, to, message, address, price, foodService
      }
    } = this.state
    const {
      match: {params: {reservationId}},
      error, submitLabel, success, successPath,
      title, shouldPrompt, promptTitle, rooms, profile
    } = this.props

    return (
      <Modal
        onSubmit={() => handleSubmit({...this.state.reservation}, rooms.length ,profile.name, reservationId)}
        {...{error, submitLabel, success, successPath, shouldPrompt, promptTitle}}
        title={
          <Grid
            alignItems="center"
            container
            justify="space-between"
          >
            {title}
            {!this.props.fullReservation &&
              <FormControlLabel
                control={
                  <Switch
                    checked={fullReservation}
                    onChange={this.handleComplexityChange}
                    value="complexity-change"
                  />
                }
                label={fullReservation ? "Részletes" : "Egyszerű"}
              />
            }
          </Grid>
        }
      >
        <Grid container spacing={16}>
          <Grid item sm={6} xs={12}>
            <TextField
              fullWidth
              label="Érkezés"
              margin="normal"
              name="from"
              onChange={this.handleDateChange}
              required
              type="date"
              value={moment(from.toDate()).format("YYYY-MM-DD")}
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <TextField
              fullWidth
              label="Távozás"
              margin="normal"
              name="to"
              onChange={this.handleDateChange}
              required
              type="date"
              value={moment(to.toDate()).format("YYYY-MM-DD")}
            />
          </Grid>
          <Grid item xs={8}>
            <Name onChange={this.handleChange} value={name}/>
          </Grid>
          <Grid container item justify="flex-end" style={{marginBottom: 10, alignSelf: "flex-end"}} xs={4}>
            <RoomSelector onChange={this.handleChange} rooms={rooms.slice(1,6)} value={roomId}/>
          </Grid>
        </Grid>

        {fullReservation &&
           <>
             <Grid container spacing={16}>
               <Grid item sm={6} xs={12}>
                 <Email onChange={this.handleChange} value={email}/>
               </Grid>
               <Grid item sm={6} xs={12}>
                 <Tel onChange={this.handleChange} value={tel}/>
               </Grid>
               <Grid item xs={12}>
                 <Address onChange={this.handleChange} value={address}/>
               </Grid>
             </Grid>
             <Grid alignItems="baseline" container spacing={16}>

               <Grid item sm={4} xs={12}>
                 <Adults onChange={this.handleChange} value={adults}/>
               </Grid>

               <Grid container item sm={8} xs={12}>
                 <Children onChange={this.handleChange} values={children}/>
               </Grid>

               <Grid item sm={3} xs={7}>
                 <FoodService onChange={this.handleChange} value={foodService}/>
               </Grid>

               <Grid item sm={9} xs={5}>
                 <Price error={priceError} onChange={this.handleChange} value={price}/>
               </Grid>

               <Grid item xs={12}>
                 <Message onChange={this.handleChange} value={message}/>
               </Grid>

             </Grid>
           </>}
      </Modal>
    )
  }
}

export default withStore(EditReservation)