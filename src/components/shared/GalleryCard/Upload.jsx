import React, {Component, Fragment} from "react"
import {Route, Link, withRouter} from "react-router-dom"

import Close from "material-ui/svg-icons/navigation/close"
import Upload from "material-ui/svg-icons/file/file-upload"
import Progress from "material-ui/LinearProgress"
import {
  Subheader,
  Paper,
  FloatingActionButton,
  RaisedButton,
  CardActions
} from "material-ui/"
import {UPLOAD} from "../../../utils/routes"
import {FileStore} from "../../../utils/firebase"


class UploadPictures extends Component {

  state = {
    progress: 0,
    filesToUpload: []
  }

  handleDelete = fileName =>
    this.setState(({filesToUpload}) => ({filesToUpload: filesToUpload.filter(fileToUpload => fileToUpload.file.name !== fileName)}))

  handleChange = ({target: {files}}) =>
    Object.values(files).forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        this.setState(({filesToUpload}) => ({filesToUpload: filesToUpload.concat({
          file,
          src: reader.result
        })}))
      }
      reader.readAsDataURL(file)
    })

  handleUpload = () => {
    const {filesToUpload} = this.state
    const {
      path, baseURL, history
    } = this.props
    Promise.all(
      filesToUpload.map(({file}) =>
        FileStore
          .ref(`${path}/${file.name}`)
          .put(file)
          .on("state_changed", snap => {
            this.setState({progress: 100 * (snap.bytesTransferred / snap.totalBytes)})
          },
          console.error,
            // Go back to the gallery view
          () => history.push(baseURL)
          )
      ))
      .then(() => this.setState({filesToUpload: []}))
      .catch(console.error)
  }


  render() {
    const {
      progress, filesToUpload
    } = this.state
    const {baseURL} = this.props

    return (
      <Fragment>
        <UploadFAB {...{baseURL}}/>
        <Route
          component={() =>
            <Fragment>
              <Subheader>Új képek feltöltése</Subheader>
              <Paper>
                {progress ?
                  <Progress
                    mode="determinate"
                    value={progress}
                  /> : null
                }
                <div className="pictures-container">
                  <div className="upload-picture">
                    <input
                      accept=".JPG, .JPEG, .jpg, .jpeg, .PNG, .png"
                      className="inputfile"
                      id="file"
                      multiple
                      name="file"
                      onChange={this.handleChange}
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
                          onClick={() => this.handleDelete(fileName)}
                          {...{src}}
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
                  <Link to={baseURL}>
                    <RaisedButton	label="Mégse"/>
                  </Link>
                </CardActions>
              </Paper>
            </Fragment>
          }
          exact
          path={`${baseURL}/${UPLOAD}`}
        />
      </Fragment>
    )
  }
}


const Picture = ({
  onClick, src
}) =>
  <div
    {...{onClick}}
    className="picture"
  >
    <Close
      color="white"
      style={{
        position: "absolute",
        right: 0,
        margin: 16
      }}
    />
    <img
      alt=""
      {...{src}}
    />
  </div>


const UploadFAB = ({baseURL}) =>
  <Link
    style={{
      position: "fixed",
      bottom: 0,
      right: 0,
      margin: 32
    }}
    title="Új képek feltöltése"
    to={`${baseURL}/${UPLOAD}`}
  >
    <FloatingActionButton secondary>
      <Upload/>
    </FloatingActionButton>
  </Link>


export default withRouter(UploadPictures)