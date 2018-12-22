import React, {Component} from 'react'


import {
  Card,
  Button,
  TextField,
  Typography,
  Grid,
  CardContent,
  CardActions
} from '@material-ui/core'
import {ROOMS_DB} from "../../lib/firebase"

import {Tip} from "../shared"

export default class Population extends Component {

  state = {
    count: 0,
    isEditing: false
  }


  componentDidMount() {
    ROOMS_DB
      .child(`${this.props.roomId}/prices/metadata/maxPeople`).on("value", snap => {
        this.setState({count: snap.val()})
      })
  }

  handleOpenEdit = () => this.setState({isEditing: true})

  handleCloseEdit = () => this.setState({isEditing: false})

  handleChange = ({target: {value}}) => this.setState({count: value})

  handleSave = () => {
    this.props.openDialog({
      title: "FIGYELEM!",
      content: "Ha az új maximális fők száma nagyobb mint a korábbi, ez az ártáblázatban új opciók létrejöttéhez vezet. Ha kevesebb, a jelenlegi árak TÖRLŐDNEK az adatbázisból!",
      submitLabel: "Módósít"
    },
    async () => {
      try {
        await ROOMS_DB
          .child(`${this.props.roomId-1}/prices/metadata/maxPeople`)
          .set(parseInt(this.state.count, 10))

        this.handleCloseEdit()
      } catch (error) {
        console.error(error)
      }
    },
    "Módosítva. Az ártáblázat ennek megfelelően hamarosan frissül."
    )
  }


  render() {
    const {
      count, isEditing
    } = this.state
    return(
      <>
        <Card>
          <CardContent>
            <Grid
              container
              justify="space-between"
            >
              <Typography>Maximum</Typography>
              {isEditing ?
                <TextField
                  label="személy"
                  onChange={this.handleChange}
                  type="number"
                  value={count}
                /> :
                <Typography><span style={{fontWeight: "bold", margin: 4}}>{count}</span> fő</Typography>
              }
            </Grid>
          </CardContent>
          <CardActions>
            <Grid
              container
              justify="flex-end"
            >
              {isEditing &&
          <Button
            onClick={this.handleCloseEdit}
            variant="outlined"
          >
          Mégse
          </Button>
              }
              <Button
                color="secondary"
                onClick={() => isEditing ? this.handleSave() : this.handleOpenEdit()}
                style={{marginLeft: 12}}
                variant="contained"
              >
                {isEditing ? "Mentés" : "Módosít"}
              </Button>
            </Grid>
          </CardActions>
        </Card>
        <Tip>A maximum személyek megváltoztatása módosítja az ártáblázatot.</Tip>
      </>
    )
  }
}