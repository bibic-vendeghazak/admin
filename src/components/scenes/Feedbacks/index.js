import React, {Component} from "react"

import {withStore} from "../../App/Store"
import {Grid, Typography, Paper} from "@material-ui/core"
import Stats from "./Stats"
import {FEEDBACKS_FS} from "../../../lib/firebase"
import FeedbacksTable from "./FeedbacksTable"
import {Tip} from "../../shared"


class Feedbacks extends Component {

  state = {
    handledFeedbacks: [],
    unhandledFeedbacks: [],
    isLoading: true
  }

  componentDidMount() {
    this.getFeedbacks()
  }

  getFeedbacks = () => {
    FEEDBACKS_FS
      // .where("timestamp", ">=", moment().add(-3, "months").toString())
      .orderBy("accepted", "desc")
      .orderBy("timestamp", "desc")
      .limit(100)
      .onSnapshot(snap => {
        const unhandledFeedbacks = []
        const handledFeedbacks = []
        snap.forEach(reservation => {
          const feedback = {
            ...reservation.data(),
            id: reservation.id
          }

          if (feedback.accepted) {
            handledFeedbacks.push(feedback)
          } else {
            unhandledFeedbacks.push(feedback)
          }
        })
        this.setState({
          isLoading: false,
          handledFeedbacks,
          unhandledFeedbacks
        })
      }, this.props.sendNotification)
  }


  render() {
    const {
      handledFeedbacks, unhandledFeedbacks, isLoading
    } = this.state

    return (
      <Grid container direction="column" spacing={16} style={{padding: 16}}>
        <Grid item>
          <Typography style={{margin: 16}} variant="h6">Statisztika</Typography>
          <Stats
            feedbacks={handledFeedbacks}
            isLoading={isLoading}
          />
        </Grid>
        <Grid item>
          <Typography style={{margin: 16}} variant="h6">Üzenetek (utolsó 100)</Typography>
          <Paper style={{paddingTop: 16}}>
            <Tip>
              A keresés mezővel kikereshetőek üzenetek, vagy kiszűrhető az összes visszajelzés ami 5-t kapott pl. a kávéra így: &quot;kávé:5&quot; (ugyanígy más értékelés is szűrhető)
            </Tip>
            <Tip>
              A kezeletlen visszajelzések mindig a lista tetején jelennek meg
            </Tip>
            <FeedbacksTable
              showDateFilter={false}
              {...{
                unhandledFeedbacks,
                handledFeedbacks
              }}
            />
          </Paper>
        </Grid>
      </Grid>

    )
  }
}


export default withStore(Feedbacks)