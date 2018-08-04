import React, {Component, Fragment} from "react"
import {ROOMS_DB, FileStore} from "../../../utils/firebase"
import {
  IconButton,
  Card,
  CardActions,
  CircularProgress,
  Subheader,
  RaisedButton
} from "material-ui"
import Progress from "material-ui/LinearProgress"
import Delete from "material-ui/svg-icons/action/delete"
import Upload from "material-ui/svg-icons/file/file-upload"
import {colors} from "../../../utils"

export default class Pictures extends Component {

  state = {
    progress: 0,
    pictures: [],
    filesToUpload: []
  }

  componentDidMount() {
    ROOMS_DB
      .child(`${this.props.roomId}/pictures`)
      .on("value", snap => {
        const pictures = []
        snap.forEach(picture => {
          pictures.push({
            key: picture.key,
            ...picture.val()
          })
        })
        this.setState({pictures})
      })
  }


  handleFileChange = e => {
    Object.values(e.target.files).forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        this.setState(({filesToUpload}) => ({filesToUpload: filesToUpload.concat({
          file,
          src: reader.result
        })}))
      }
      reader.readAsDataURL(file)
    })
  }

  // REVIEW: Code is similar (identical?) to GalleryCard/Upload
  handleUpload = () => {
    const {filesToUpload} = this.state
    const {roomId} = this.props
    Promise.all(
      filesToUpload.map(fileToUpload =>
        FileStore
          .ref(`rooms/${roomId}/${fileToUpload.file.name}`)
          .put(fileToUpload.file)
          .on("state_changed",
            snap => {
              this.setState({progress: 100 * (snap.bytesTransferred / snap.totalBytes)})
            },
            console.error,
            () => this.setState({progress: 0})
          )

      ))
      .then(() => this.setState({filesToUpload: []}))
      .catch(console.error)
  }


  render() {
    const {
      progress, pictures, filesToUpload
    } = this.state
    const {roomId} = this.props
    return (
      <Card className="room-edit-block">
        <Subheader>Jelenlegi képek</Subheader>
        <div
          className="pictures-container"
          style={{
            justifyContent: !pictures.length ? "center" : "",
            alignItems: !pictures.length ? "center" : ""
          }}
        >
          {pictures.length ?
            pictures.map(({
              key, fileName, SIZE_360: src
            }) =>
              <Picture {...{
                key,
                roomId,
                fileName,
                src,
                pictureId: key
              }}
              />
            ) :
            <CircularProgress/>}
        </div>
        <Subheader>Új képek feltöltése</Subheader>
        <div className="pictures-container">
          <div className="upload-picture">
            <input
              accept=".JPG, .JPEG, .jpg, .jpeg, .PNG, .png"
              className="inputfile"
              id="file"
              multiple
              name="file"
              onChange={this.handleFileChange}
              type="file"
              value=""
            />
            <label
              className="file-label"
              htmlFor="file"
              title="Válassza ki a feltölteni kívánt képeket"
            >
              <Upload color="grey"/>
            </label>
          </div>
          {filesToUpload.length ?
            <Fragment>
              {filesToUpload.map(({
                file: {name: fileName}, src
              }) =>
                <Picture
                  key={fileName}
                  {...{
                    fileName,
                    src
                  }}
                />
              )}
            </Fragment> : null}
        </div>
        <CardActions>
          <RaisedButton
            disabled={!filesToUpload.length}
            label="Feltöltés"
            onClick={this.handleUpload}
            secondary
          />
        </CardActions>
        <Progress
          mode="determinate"
          value={progress}
        />
      </Card>
    )
  }
}


class Picture extends Component {
  state = {isEditing: false}

  handleClick = () => this.setState(({isEditing}) => ({isEditing: !isEditing}))

  handleDeletePicture = () => {
    const {
      roomId, pictureId
    } = this.props
    ROOMS_DB
      .child(`${roomId}/pictures/${pictureId}`)
      .remove()
      .catch(console.error)
  }

  render() {
    const {isEditing} = this.state
    const {src} = this.props
    return (
      <div
        className="picture"
        onClick={() => isEditing ? this.handleDeletePicture () : this.handleClick ()}
      >
        {
          isEditing ?
            <div className="edit">
              <IconButton
                onClick={this.handleDeletePicture}
                tooltip="Kép törlése"
              >
                <Delete color={colors.red} />
              </IconButton>
            </div> :
            <div className="hover">
              <span>
                {this.props.fileName}
              </span>
            </div>
        }
        <img
          alt=""
          {...{src}}
        />
      </div>
    )
  }
}