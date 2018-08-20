import React, {Component} from "react"

import Services from "./Services"
import Population from "./Population"
import Prices from "./Prices"
import Availability from "./Availability"
import Description from "./Description"
import {Gallery} from '../../shared'

import {ROOMS_DB, ROOM_SERVICES_DB} from "../../../utils/firebase"

import {Typography, Grid} from "@material-ui/core"
import Store from "../../App/Store"


export default class EditRoom extends Component {


  handleRoomEdit(event) {
    const e = event.target
    const {id} = this.state
    let dataType = e.getAttribute("data-type")
    if (dataType.includes("room-service")) {
      // Handle room service changes
      const {roomServices} = this.state
      dataType = dataType.replace("room-service ","")
      let {inRoom} = roomServices[dataType]

      inRoom.includes(id) ? inRoom = inRoom.filter(e => e !== id) : inRoom.push(id)
      ROOM_SERVICES_DB.child(`${dataType}/inRoom`).set(inRoom)
    } else if(dataType.includes("max-people")) {
      dataType = dataType.replace("max-people ","")
      let {value} = e
      value = parseInt(value,10) || 0
      ROOMS_DB.child(`${id-1}/${dataType}`).set(value)
    }
    // NOTE: Update firebase
  }

  populatePrices(){
    const {id} = this.state
    const roomRef = ROOMS_DB.child(id-1)
    const {
      prices, maxAdults, maxChildren
    } = this.state
    Object.keys(prices).forEach(key => {
      for (let i = 0; i < maxAdults; i++) {
        for (let j = 0; j <= maxChildren; j++) {
          if (i+j <= maxAdults) {
            if(!prices[key][`${i+1}_${j}`]) {
              prices[key][`${i+1}_${j}`] = {
                adults: i+1,
                children: j,
                price: 0
              }
            }
          }
        }
      }
      // Remove rest of the prices.
      const priceType = prices[key]
      Object.keys(priceType).forEach(key => {
        const {
          adults, children
        } = priceType[key]
        if (adults > maxAdults || children > maxChildren) {
          delete priceType[key]
        }
      })
    })
    roomRef.child("/prices").set(prices)
  }

  render(){
    let {roomId} = this.props.match.params
    roomId = parseInt(roomId, 10)
    return(
      <Store.Consumer>
        {({
          sendNotification, openDialog
        }) =>
          <Grid
            container
            direction="column"
            style={{
              maxWidth: 540,
              margin: "16px auto"
            }}
          >
            <Section
              title="Szoba állapota"
            >
              <Availability
                {...{
                  roomId,
                  openDialog
                }}
              />
            </Section>
            <Section title="Szoba képek"><Gallery relativeFAB/></Section>
            <Section title="Szoba leírása">
              <Description {...{
                roomId,
                sendNotification
              }}
              />
            </Section>
            <Section title="Szolgáltatások"><Services {...{roomId}}/></Section>
            <Section title="Fekhely">
              <Population
                {...{
                  roomId,
                  openDialog
                }}
              />
            </Section>
            <Section title="Ártáblázat"><Prices {...{roomId}}/></Section>
          </Grid>
        }
      </Store.Consumer>
    )
  }
}


const Section = ({
  title, children
}) =>
  <Grid
    item
    style={{margin: 8}}
  >
    <Typography variant="subheading">{title}</Typography>
    {children}
  </Grid>