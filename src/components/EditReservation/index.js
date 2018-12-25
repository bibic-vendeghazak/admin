import React, {Component} from "react"

import {RESERVATIONS_FS} from "../../lib/firebase"

import {Switch, Grid, FormControlLabel} from '@material-ui/core'


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
import {DateField} from "./DateField"

class EditReservation extends Component {

  state = {
    isDetailed: false,
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
      from: TODAY.clone().hours(14).toDate(),
      to: TOMORROW.clone().hours(10).toDate(),
      handled: true,
      foodService: "breakfast",
      price: 1
    },
    priceError: null
  }

  componentDidMount = async () => {
    const {match: {params: {reservationId}}, isDetailed} = this.props
    this.setState({isDetailed})
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

  handleDetailChange = () =>
    this.setState(({isDetailed}) => ({isDetailed: !isDetailed}))

  updatePrice = () => {
    const {error, price} = getPrice(this.state.reservation, this.props.rooms)
    this.setState(({reservation}) => ({
      priceError: error,
      reservation: {...reservation, price}})
    )
  }

  render() {
    const {
      isDetailed, priceError, reservation: {
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
        onSubmit={() => handleSubmit({...this.state.reservation}, rooms.length , profile.name, reservationId)}
        {...{error, submitLabel, success, successPath, shouldPrompt, promptTitle}}
        title={
          <Grid
            alignItems="center"
            container
            justify="space-between"
          >
            {title}
            {!this.props.isDetailed &&
              <FormControlLabel
                control={
                  <Switch
                    checked={isDetailed}
                    onChange={this.handleDetailChange}
                    value="complexity-change"
                  />
                }
                label={isDetailed ? "Részletes" : "Egyszerű"}
              />
            }
          </Grid>
        }
      >
        <Grid container spacing={16}>
          <Grid item sm={6} xs={12}>
            <DateField
              from={from}
              onChange={this.handleChange}
              to={to}
              type="from"
            />
          </Grid>
          <Grid item sm={6} xs={12}>
            <DateField
              from={from}
              onChange={this.handleChange}
              to={to}
              type="to"
            />
          </Grid>
          <Grid item xs={8}>
            <Name onChange={this.handleChange} value={name}/>
          </Grid>
          <Grid container item justify="flex-end" style={{marginBottom: 10, alignSelf: "flex-end"}} xs={4}>
            <RoomSelector onChange={this.handleChange} rooms={rooms.slice(1,6)} value={roomId}/>
          </Grid>
        </Grid>

        {isDetailed &&
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