import React, {Component} from "react"
import PropTypes from "prop-types"
import {DB} from "../../../lib/firebase"


import {Button, TextField, Dialog, DialogActions, DialogContent, Grid, DialogTitle} from "@material-ui/core"
import Delete from "@material-ui/icons/DeleteRounded"

import {Loading} from ".."
import {toRoute} from "../../../utils"
import {withStore} from "../../../db"

class GalleryItemEdit extends Component {
  state = {
    title: "",
    desc: "",
    SIZE_640: null
  }

  async componentDidMount() {
    const {url, folder, match: {params: {listItemId}}} = this.props

    const item = await (
      await DB
        .ref(toRoute(folder, url, listItemId))
        .once("value")
    ).val()

    if (item) this.setState(item)
  }

  handleDeleteGalleryItem = () => {
    const {
      url, match: {params: {listItemId}}
    } = this.props

    this.props.openDialog(
      {title: "Biztos törli a képet?"},
      async () => await DB.ref(toRoute("galleries", url.replace("/", ""), listItemId)).remove(),
      "A kép sikeresen törölve",
      this.handleClose
    )
  }

    handleSubmitText = () => {
      const {
        url,
        folder, match: {params: {listItemId}}
      } = this.props
      const {
        title, desc
      } = this.state

      this.props.openDialog(
        {title: "Menti a változtatásokat?"},
        async () => await DB
          .ref(toRoute(folder, url, listItemId))
          .update({title, desc}),
        "Mentve", this.handleClose
      )
    }

  handleClose = () => this.props.history.goBack()

  handleTextChange = ({target: {name, value}}) => this.setState({[name]: value})

  render() {
    const {title, desc, SIZE_640} = this.state

    const {hasText} = this.props
    return (
      <Dialog
        fullWidth
        maxWidth="sm"
        onClose={this.handleClose}
        open
      >
        {hasText && <DialogTitle>Kép szerkesztése</DialogTitle>}
        <DialogContent>

          <Grid alignItems="center" container justify="center">
            <Grid item sm={hasText? 4 : 12}>
              {SIZE_640 ?
                <img
                  alt={title}
                  src={SIZE_640}
                  width="100%"
                /> : <Loading/>
              }
            </Grid>
            {
              hasText &&
            <Grid container item sm={8} style={{padding: 8}}>
              <TextField
                fullWidth
                label="Cím"
                multiline
                name="title"
                onChange={this.handleTextChange}
                value={title}
              />
              <TextField
                fullWidth
                label="Leírás"
                multiline
                name="desc"
                onChange={this.handleTextChange}
                style={{marginTop: 16}}
                value={desc}
              />
            </Grid>
            }
          </Grid>
        </DialogContent>
        <DialogActions>
          <Grid
            container
            justify={hasText ? "space-between" : "flex-end"}
          >
            {hasText &&
              <Button
                color="secondary"
                onClick={this.handleDeleteGalleryItem}
                variant="text"
              >
                <Delete/>
                  Törlés
              </Button>
            }
            <Grid item>
              <Button
                onClick={this.handleClose}
                style={{marginRight: 12}}
                variant="outlined"
              >
                  Mégse
              </Button>
              {hasText ?
                <Button
                  color="secondary"
                  onClick={this.handleSubmitText}
                  variant="contained"
                >
                  Mentés
                </Button> :
                <Button
                  color="secondary"
                  onClick={this.handleDeleteGalleryItem}
                  variant="contained"
                >
                  Törlés
                </Button>
              }
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    )
  }
}

GalleryItemEdit.propTypes = {
  folder: PropTypes.string,
  path: PropTypes.string,
  match: PropTypes.object,
  history: PropTypes.object,
  sendNotification: PropTypes.func,
  openDialog: PropTypes.func,
  hasText: PropTypes.bool
}

export default withStore(GalleryItemEdit)