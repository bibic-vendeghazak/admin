import React, {Component, Fragment} from "react"
import {Route, Link} from "react-router-dom"
import {arrayMove} from "react-sortable-hoc"
import {DB} from "../../../utils/firebase"
import {EDIT} from "../../../utils/routes"

import Upload from "./Upload"

import {Section, Loading, Tip} from ".."
import {SortableList} from "./Sort"

import {
  Card,
  CardActions,
  CardMedia,
  CardText,
  TextField,
  RaisedButton,
  Paper,
  Subheader
} from "material-ui"

import Save from "material-ui/svg-icons/content/save"
import Cancel from "material-ui/svg-icons/navigation/cancel"
import Delete from "material-ui/svg-icons/action/delete"


class Gallery extends Component {
  state = {
    pictures: [],
    isEmpty: false
  }

  componentDidMount() {
    // NOTE: Sorting on client side, for now does not expect big amount of data.
    DB
      .ref(`${this.props.path}/pictures`)
      .on("value", snap => {
        if (snap.exists()) {
          this.setState({pictures: Object
            .entries(snap.val() || {})
            .sort((a, b) => a[1].order - b[1].order)})
        } else this.setState({isEmpty: true})
      })
  }

  handleSort = ({
    oldIndex, newIndex
  }) => {
    const {pictures} = this.state
    Promise.all(
      arrayMove(pictures, oldIndex, newIndex)
        .map(([pictureId, rest], index) =>
          DB.ref(`${this.props.path}/pictures/${pictureId}`)
            .set({
              ...rest,
              order: index
            })
        ))
    //TODO: Inform user by notification
      .then(() => {
        console.log("Saved")
      })
      .catch(console.error)
  }

  render() {
    const {
      pictures, isEmpty
    } = this.state
    const {
      baseURL, path
    } = this.props

    return (
      <div style={{margin: "1.5%"}}>
        <Upload {...{
          baseURL,
          path
        }}
        />
        <Route
          exact
          path={`${baseURL}/:galleryItemId/${EDIT}`}
          render={({
            match, history
          }) =>
            <GalleryItemEdit {...{
              history,
              match,
              path,
              baseURL
            }}
            />
          }
        />
        <Route
          exact
          path={baseURL}
          render={() =>
            <Fragment>
              <Subheader>Képgaléria</Subheader>
              <Paper
                style={{
                  padding: "1em 2.5em 1em 1em",
                  margin: "1.5% 0",
                  display: "grid",
                  justifyItems: "center",
                  minHeight: 240,
                  alignItems: "center"
                }}
              >
                {pictures.length ?
                  <div>
                    <SortableList
                      axis="xy"
                      baseURL={baseURL}
                      items={pictures}
                      onSortEnd={this.handleSort}
                      useWindowAsScrollContainer
                    />
                  </div> :
                  <Loading isEmpty={isEmpty}/>
                }
              </Paper>
              <Tip>
                A sorrendet "fogd és vidd" módszerrel lehet változtatni. A változtatások automatikusan mentésre kerülnek.
              </Tip>
            </Fragment>
          }
        />
      </div>
    )
  }
}

export default Gallery

class GalleryItemEdit extends Component {
  state = {
    title: "",
    desc: "",
    picture: {}
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
    DB
      .ref(`${path}/pictures/${galleryItemId}`)
      .once("value", snap => this.setState({picture: snap.val()}))
  }


  //BUG: Data is deleted before the route is changed to baseURL, that causes a "Warning: Can't call setState (or forceUpdate) on an unmounted component."
  handleDeleteGalleryItem = () => {
    const {
      baseURL, path, history, match: {params: {galleryItemId}}
    } = this.props
    const pathRef= DB.ref(path)
    Promise.all([
      pathRef.child(`metadata/${galleryItemId}`).remove(),
      pathRef.child(`pictures/${galleryItemId}`).remove()
    ])
      .then(() => history.push(baseURL))
      .catch(console.error)
  }

    handleSubmitText = () => {
      const {
        baseURL, path, history, match: {params: {galleryItemId}}
      } = this.props
      const {
        title, desc
      } = this.state
      DB
        .ref(`${path}/metadata/${galleryItemId}`)
        .update({
          title,
          desc
        })
        .then(() => history.push(baseURL))
        .catch(console.error)
    }

  handleTextChange = ({target: {
    name, value
  }}) => this.setState({[name]: value})

  render() {
    const {
      title, desc, picture: {SIZE_640}
    } = this.state
    const {baseURL} = this.props

    return (
      <Section>
        <Card>
          <CardMedia>
            <img
              alt={title}
              src={SIZE_640}
            />
          </CardMedia>
          <CardText>
            <TextField
              floatingLabelText="Kép címe"
              fullWidth
              multiLine
              name="title"
              onChange={this.handleTextChange}
              value={title}
            />
            <TextField
              floatingLabelText="Kép leírása"
              fullWidth
              multiLine
              name="desc"
              onChange={this.handleTextChange}
              value={desc}
            />
          </CardText>
          <CardActions>
            <div>
              <RaisedButton
                icon={<Delete/>}
                label="Törlés"
                labelPosition="before"
                onClick={this.handleDeleteGalleryItem}
                secondary
              />
              <Link to={baseURL}>
                <RaisedButton
                  icon={<Cancel/>}
                  label="Mégse"
                  labelPosition="before"
                  style={{margin: 12}}
                />
              </Link>
              <RaisedButton
                icon={<Save/>}
                label="Mentés"
                labelPosition="before"
                onClick={this.handleSubmitText}
                primary
              />
            </div>
          </CardActions>
        </Card>
      </Section>
    )
  }
}