import React from "react"

import Services from "./Services"
import Population from "./Population"
import Prices from "./Prices"
import Availability from "./Availability"
import Description from "./Description"
import {Gallery} from "../shared"

import {Typography, Grid} from "@material-ui/core"
import {withStore} from "../../db"
import hu from "../../lang/hu"

export const EditRoom = ({sendNotification, openDialog, roomId}) =>
  <Grid container direction="column" style={{maxWidth: 640, margin: "16px auto"}}>
    <Section title={hu.rooms.editRoom.sections.availability.title}>
      <Availability {...{roomId, openDialog}} />
    </Section>
    <Section title={hu.rooms.editRoom.sections.gallery.title}>
      <Gallery hasText={false} relativeFAB/>
    </Section>
    <Section title={hu.rooms.editRoom.sections.description.title}>
      <Description {...{roomId, sendNotification}}/>
    </Section>
    <Section title={hu.rooms.editRoom.sections.services.title}>
      <Services {...{roomId, sendNotification}}/>
    </Section>
    <Section title={hu.rooms.editRoom.sections.population.title}>
      <Population {...{roomId, openDialog}}/>
    </Section>
    <Section title={hu.rooms.editRoom.sections.prices.title}>
      <Prices {...{roomId}}/>
    </Section>
  </Grid>


export default withStore(EditRoom)


const Section = ({title, children}) =>
  <Grid item style={{margin: 8}}>
    <Typography variant="subtitle1">{title}</Typography>
    {children}
  </Grid>