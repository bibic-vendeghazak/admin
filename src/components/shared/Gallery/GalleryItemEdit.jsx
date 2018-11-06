import React, {Component} from "react"
import PropTypes from "prop-types"
import {DB} from "../../../lib/firebase"


import {Button, TextField, Dialog, DialogActions, DialogContent, Grid, DialogTitle} from "@material-ui/core"
import Delete from "@material-ui/icons/DeleteRounded"

import {Loading} from ".."
import {toRoute} from "../../../utils"
import {withStore} from "../../App/Store"

class GalleryItemEdit extends Component {
  state = {
    title: "",
    desc: "",
    SIZE_640: null
  }

  componentDidMount() {
    const {
      url,
      folder, match: {params: {listItemId}}
    } = this.props
    console.log(toRoute(folder, url, listItemId))
    DB
      .ref(toRoute(folder, url, listItemId))
      .once("value", snap => {
        if (snap.exists()) {
          this.setState(snap.val())
        }
      })
      .catch(this.props.sendNotification)
  }

  handleDeleteGalleryItem = () => {
    const {
      url, match: {params: {listItemId}}
    } = this.props

    this.props.openDialog(
      {title: "Biztos törli a képet?"},
      () => DB.ref(toRoute("galleries", url, listItemId)).remove(),
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
        () => DB
          .ref(toRoute(folder, url, listItemId))
          .update({
            title,
            desc
          }),
        "Mentve", this.handleClose
      )
    }

  handleClose = () => {
    this.props.history.goBack()
  }

  handleTextChange = ({target: {
    name, value
  }}) => this.setState({[name]: value})

  render() {
    const {
      title, desc, SIZE_640
    } = this.state

    const {hasText} = this.props
    return (
      <Dialog
        onClose={this.handleClose}
        open
      >
        {hasText &&
          <DialogTitle>Kép szerkesztése</DialogTitle>
        }
        <DialogContent>
          {SIZE_640 ?
            <img
              alt={title}
              src={SIZE_640}
              width={hasText ? 120 : 240}
            /> : <Loading/>
          }
          {
            hasText &&
            <Grid container>
              <TextField
                fullWidth
                label="Kép címe"
                name="title"
                onChange={this.handleTextChange}
                value={title}
              />
              <TextField
                fullWidth
                label="Kép leírása"
                multiline
                name="desc"
                onChange={this.handleTextChange}
                value={desc}
              />
            </Grid>
          }
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
                variant="flat"
              >
                <Delete/>
                  Kép törlése
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