import React, {Component, Fragment} from "react"
import {PARAGRAPHS_DB} from "../../../utils/firebase"

import {Grid, TextField, CardActions, Button, Divider, Card, CardContent, Typography, CardHeader, Tooltip} from "@material-ui/core"
import {SortableHandle} from "react-sortable-hoc"

import DragIndicator from "@material-ui/icons/DragIndicator"
import {withStore} from "../../App/Store"

const DragHandle = SortableHandle(
  () => (
    <Tooltip title="Fogd & vidd az újrarendezéshez">
      <DragIndicator style={{cursor: "ns-resize"}}/>
    </Tooltip>
  )
)

class TextParagraph extends Component {

  state = {
    value: null,
    isEditing: false
  }


  handleOpenEdit = () => {
    this.setState({isEditing: true})
  }

  handleCloseEdit = () => this.setState({
    isEditing: false,
    value: null
  })

  handleTextChange = ({target: {value}}) => this.setState({value})


  handleSubmitText = () => {
    const {value} = this.state
    const {
      item: {
        key, text
      }, path, openDialog
    } = this.props
    if (value && text !== value) {
      openDialog(
        {
          title: "Menti az alábbi változtatást?",
          submitLabel: "Mentés",
          message: value
        },
        () => PARAGRAPHS_DB.child(`${path}/${key}/text`)
          .set(value)
          .then(this.handleCloseEdit),
        "Bekezdés frissítve."
      )
    } else {
      this.handleCloseEdit()
    }

  }

  handleDeleteParagraph = () => {
    const {
      openDialog, path, item: {key}
    } = this.props
    return openDialog(
      {
        title: "Biztos törölni akarja ezt a bekezdést?",
        submitLabel: "Törlés",
        message: "A folyamat nem visszafordítható!"
      },
      () => PARAGRAPHS_DB.child(`${path}/${key}`).remove(),
      "Bekezdés törölve."
    )
  }

  render() {
    const {
      value, isEditing
    } = this.state
    const {text} = this.props.item
    return (
      <Card style={{margin: "8px 16px"}}>
        <CardContent>
          <CardHeader action={<DragHandle/>}/>
          {isEditing ?
            <TextField
              autoFocus
              fullWidth
              id="text"
              label="bekezdés szövege"
              multiline
              onChange={this.handleTextChange}
              rows={6}
              value={value || text}
            /> :
            <Typography
              component="p"
              onClick={this.handleOpenEdit}
              style={{
                userSelect: "none",
                cursor: "pointer"
              }}
            >{text || "Üres bekezdés"}</Typography>
          }
        </CardContent>
        <Divider/>
        <CardActions>
          <Grid container justify="flex-end">
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
                  color="secondary"
                  onClick={this.handleDeleteParagraph}
                  size="small"
                >
                Törlés
                </Button>
                <Button
                  onClick={this.handleOpenEdit}
                  size="small"
                  style={{marginRight: 6}}
                >
                  Módosít
                </Button>
              </Fragment>
            }
          </Grid>
        </CardActions>
      </Card>
    )
  }
}

export default withStore(TextParagraph)