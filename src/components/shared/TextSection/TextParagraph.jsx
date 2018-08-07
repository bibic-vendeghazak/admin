import React, {Component, Fragment} from "react"
import {PARAGRAPHS_DB} from "../../../utils/firebase"

import {ListItem, TextField, CardActions, Button, Divider, Card, CardContent, Typography} from "@material-ui/core"

export default class TextParagraph extends Component {

  state = {
    text: null,
    isEditing: false
  }


  handleOpenEdit = () => this.setState({isEditing: true})

  handleCloseEdit = () => this.setState({
    isEditing: false,
    text: null
  })

  handleTextChange = ({target: {value: text}}) => this.setState({text})


  handleSubmitText = () =>
    PARAGRAPHS_DB.child(`${this.props.path}/text`)
      .set(this.state.text)
      .then(this.handleCloseEdit)

  handleDeleteParagraph = () => PARAGRAPHS_DB.child(this.props.path).remove()

  render() {
    const {
      text, isEditing
    } = this.state

    return (
      <ListItem style={{cursor: "move"}}>
        <Card
          style= {{minWidth: "100%"}}
        >
          <CardContent>
            {isEditing ?
              <TextField
                fullWidth
                id="text"
                label="bekezdés szövege"
                multiline
                onChange={this.handleTextChange}
                // REVIEW: Seems to be a hacky solution. Try something else...?
                value={text || this.props.text}
              /> :
              <Typography
                component="p"
                style={{userSelect: "none"}}
              >{this.props.text || "Üres"}</Typography>
            }

          </CardContent>
          <Divider/>
          <CardActions>
            {isEditing ?
              <Fragment>
                <Button
                  onClick={this.handleCloseEdit}
                  size="small"
                  style={{marginRight: 6}}
                >Mégse</Button>
                <Button
                  color="secondary"
                  onClick={this.handleSubmitText}
                  size="small"
                >
                  Mentés
                </Button>
              </Fragment> :
              <Fragment>
                <Button
                  onClick={this.handleOpenEdit}
                  size="small"
                  style={{marginRight: 6}}
                >
                  Módosít
                </Button>
                <Button
                  color="secondary"
                  onClick={this.handleDeleteParagraph}
                  size="small"
                >
                Törlés
                </Button>
              </Fragment>
            }
          </CardActions>
        </Card>
      </ListItem>
    )
  }
}