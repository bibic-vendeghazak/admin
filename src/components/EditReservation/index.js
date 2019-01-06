import React, {Component} from "react"

import {Grid} from '@material-ui/core'

import {Modal} from "../shared"
import Children from "./Children"
import Adults from "./Adults"
import Price from "./Price"
import FoodService from "./FoodService"
import Message from "./Message"
import Email from "./Email"
import Name from "./Name"
import RoomSelector from "./RoomSelector"
import Tel from "./Tel"
import Address from "./Address"
import {getPrice, handleSubmit} from "./functions"
import {DateField} from "./DateField"
import {ComplexitySwitch} from "./ComplexitySwitch"
import {StoreContext} from "../../db/Store"

export class EditReservation extends Component {

  static contextType = StoreContext

  state = {
    isDetailed: false,
    priceError: null
  }

  componentDidMount = async () => {
    try {
      const {isDetailed, match: {params: {reservationId}}} = this.props
      await this.context.fetchReservation(reservationId)
      this.updatePrice()
      this.setState({isDetailed})
    } catch (error) {
      this.context.sendNotification(error)
    }
  }

  handleChange = (name, value, shouldUpdatePrice) => {
    this.context.updateReservation(name, value, () => {
      shouldUpdatePrice && this.updatePrice()
    })
  }

  handleDetailChange = () =>
    this.setState(({isDetailed}) => ({isDetailed: !isDetailed}))

  updatePrice = () => {
    const {reservation, rooms} = this.context
    const {error, price} = getPrice(reservation, rooms)
    this.context.updateReservation("price", price)
    this.setState({priceError: error})
  }

  render() {
    const {
      isDetailed, priceError
    } = this.state
    const {
      match: {params: {reservationId}},
      error, submitLabel, success, successPath,
      title, shouldPrompt, promptTitle
    } = this.props
    const {rooms, profile,
      reservation: {
        name, tel, email,
        roomId, adults, children,
        from, to, message, address, price, foodService
      }} = this.context
    return (
      <Modal
        onSubmit={async () => await handleSubmit({...this.context.reservation}, rooms.length , profile.name, reservationId)}
        {...{error, submitLabel, success, successPath, shouldPrompt, promptTitle}}
        title={
          <Grid
            alignItems="center"
            container
            justify="space-between"
          >
            {title}
            {!this.props.isDetailed &&
              <ComplexitySwitch
                checked={isDetailed}
                onChange={this.handleDetailChange}
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
            <RoomSelector onChange={this.handleChange} rooms={rooms} value={roomId}/>
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

export default EditReservation