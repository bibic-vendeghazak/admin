import React, {Component} from 'react'

import {
  Card,
  CardActions,
  Button,
  TextField,
  CardContent, Grid, Typography
} from "@material-ui/core"

import {ROOMS_DB} from '../../../../lib/firebase'

export default class Description extends Component {

  state = {
    description: "",
    isEditing: false
  }

  componentDidMount() {
    ROOMS_DB
      .child(`${this.props.roomId-1}/description`)
      .on("value", snap => {
        this.setState({description: snap.val()})
      })
  }


  handleOpenEdit = () => this.setState({isEditing: true})

  handleCloseEdit = () => this.setState({isEditing: false})

  handleDescriptionChange = description => this.setState({description})

  handleSubmitDescription = () => {
    ROOMS_DB
      .child(`${this.props.roomId-1}/description`)
      .set(this.state.description).then(() => this.handleCloseEdit())
      .then(() => this.props.sendNotification({
        code: "success",
        message: "A leírás sikeresen frissítve lett."
      }))
      .catch(this.props.sendNotification)

  }


  render() {
    const {
      description, isEditing
    } = this.state
    return (
      <Card>
        <CardContent>
          {isEditing ?
            <TextField
              fullWidth
              id="description"
              label="leírás"
              multiline
              onChange={e => this.handleDescriptionChange(e.target.value)}
              value={description}
            /> :
            <Typography>{description}</Typography>
          }
        </CardContent>
        <CardActions>
          <Grid
            container
            justify="flex-end"
          >
            {isEditing ?
              [
                <Button
                  key="0"
                  onClick={this.handleCloseEdit}
                  style={{marginRight: 16}}
                  variant="outlined"
                >
                  Mégse
                </Button>,
                <Button
                  color="secondary"
                  key="1"
                  onClick={this.handleSubmitDescription}
                  variant="contained"
                >
                  Mentés
                </Button>
              ] :
              <Button
                color="secondary"
                onClick={this.handleOpenEdit}
                variant="contained"
              >
                Módosít
              </Button>
            }
          </Grid>
        </CardActions>
      </Card>
    )
  }
}