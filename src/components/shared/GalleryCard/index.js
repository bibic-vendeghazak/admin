import React, {Component, Fragment} from "react"
import {Route} from "react-router-dom"
import {arrayMove} from "react-sortable-hoc"
import {DB} from "../../../utils/firebase"
import {EDIT} from "../../../utils/routes"

import Upload from "./Upload"

import {Loading, Tip} from ".."
import Sort from "../Sort"
import GalleryItem from "./GalleryItem"

import {Button, TextField, Card, CardActions, Dialog, DialogActions, DialogContent, Grid, DialogTitle} from "@material-ui/core"
import Delete from '@material-ui/icons/DeleteRounded'

import {withStore} from "../../App/Store"


class Gallery extends Component {
  state = {
    pictures: null,
    isEmpty: false
  }

  componentDidMount() {
    // NOTE: Sorting on client side, for now does not expect big amount of data.
    DB
      .ref(`${this.props.path}/pictures`)
      .on("value", snap => {
        if (snap.exists()) {
          console.log(snap.val())
          this.setState({pictures: Object
            .entries(snap.val())
            .sort((a, b) => a[1].order - b[1].order)})
        } else this.setState({
          isEmpty: true,
          pictures: null
        })
      })
  }

  handleSort = ({
    oldIndex, newIndex
  }) => {
    const {pictures} = this.state
    const newPictures = arrayMove(pictures, oldIndex, newIndex)
    if (pictures.toString() !== newPictures.toString()) {
      Promise.all(
        newPictures
          .map(([pictureId, rest], index) =>
            DB.ref(`${this.props.path}/pictures/${pictureId}`)
              .set({
                ...rest,
                order: index
              })
          ))
      //TODO: Inform user by notification
        .then(() => {
          this.props.sendNotification({
            code: "success",
            message: "Sorrend mentve."
          })
        })
        .catch(this.props.sendNotification)
    }
  }

  render() {
    const {
      pictures, isEmpty
    } = this.state
    const {
      baseURL, path, relativeFAB, sendNotification, hasText, openDialog
    } = this.props

    return (
      <Fragment>
        <Card style={{padding: 8}}>
          <Route
            exact
            path={`${baseURL}/:galleryItemId/${EDIT}`}
            render={({
              match, history
            }) =>
              <GalleryItemEdit {...{
                hasText,
                history,
                match,
                path,
                baseURL,
                openDialog,
                sendNotification
              }}
              />
            }
          />
          <Route
            path={baseURL}
            render={() =>
              pictures ?
                <Sort
                  axis="xy"
                  component={GalleryItem}
                  containerStyle={{spacing: 16}}
                  distance={48}
                  helperClass="sort-helper"
                  items={pictures}
                  onSortEnd={this.handleSort}
                  path={baseURL}
                  useWindowAsScrollContainer
                /> :
                <Loading isEmpty={isEmpty}/>
            }
          />
          <CardActions>
            <Upload {...{
              baseURL,
              path,
              relativeFAB
            }}
            />
          </CardActions>
        </Card>
        <Tip>
          A sorrendet "fogd és vidd" módszerrel lehet változtatni. A változtatások automatikusan mentésre kerülnek.
        </Tip>
      </Fragment>
    )
  }
}

export default withStore(Gallery)

class GalleryItemEdit extends Component {
  state = {
    title: "",
    desc: "",
    picture: null
  }


  componentDidMount() {
    const {
      path, match: {params: {galleryItemId}}
    } = this.props
    DB
      .ref(`${path}/metadata/${galleryItemId}`)
      .once("value", snap => {
        if (snap.exists()) {
          this.setState({
            title: snap.val().title,
            desc: snap.val().desc
          })
        }
      })
      .catch(this.props.senNotification)

    DB
      .ref(`${path}/pictures/${galleryItemId}`)
      .once("value", snap => this.setState({picture: snap.val()}))
      .catch(this.props.senNotification)
  }

  handleDeleteGalleryItem = () => {
    const {
      path, match: {params: {galleryItemId}}
    } = this.props
    const pathRef= DB.ref(path)

    this.props.openDialog(
      {title: "Biztos törli a képet?"},
      () => Promise.all([
        pathRef.child(`metadata/${galleryItemId}`).remove(),
        pathRef.child(`pictures/${galleryItemId}`).remove()
      ]),
      "A kép sikeresen törölve",
      this.handleClose
    )
  }

    handleSubmitText = () => {
      const {
        path, match: {params: {galleryItemId}}
      } = this.props
      const {
        title, desc
      } = this.state

      this.props.openDialog(
        {title: "Menti a változtatásokat?"},
        () => DB
          .ref(`${path}/metadata/${galleryItemId}`)
          .update({
            title,
            desc
          }),
        "Mentve", this.handleClose
      )
    }

  handleClose = () => this.props.history.push(this.props.baseURL)

  handleTextChange = ({target: {
    name, value
  }}) => this.setState({[name]: value})

  render() {
    const {
      title, desc, picture
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
          {picture ?
            <img
              alt={title}
              src={picture.SIZE_640}
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