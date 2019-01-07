import React, {Component} from "react"
import PropTypes from "prop-types"
import {Route, Link} from "react-router-dom"

import {routes, toRoute} from "../../../utils"
import {FileStore} from "../../../lib/firebase"
import {Tip, Modal} from ".."
import {Grid, Tooltip, GridList, GridListTile, GridListTileBar, IconButton, LinearProgress, Input, InputAdornment, Fab} from "@material-ui/core"

import Upload from "@material-ui/icons/CloudUploadRounded"
import Cancel from "@material-ui/icons/CloseRounded"
import {withStore} from "../../../db"
import moment from "../../../lib/moment"

class UploadPictures extends Component {

  state = {
    bytesUploaded: 0,
    bytesToUpload: 0,
    files: [],
    style: {
      position: "fixed",
      right: 32,
      bottom: 32,
      zIndex: 1000
    }
  }

  componentDidMount() {
    const style = {...this.state.style}
    const {fabPosition, offsetY} = this.props

    if (fabPosition === "left") {
      delete style.right
      style.left = 240 + 32
    }
    if (offsetY) {
      style.bottom -= offsetY
    }

    this.setState({style})
  }


  handleDelete = fileName =>
    this.setState(({files}) =>
      ({files: files.filter(({file: {name}}) => name !== fileName)})
    )

  handleChange = ({target: {files}}) => {
    Object.values(files).forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () =>
        this.setState(({files, bytesToUpload}) => ({
          files: [...files, {file, src: reader.result}],
          bytesToUpload: bytesToUpload + file.size
        }))
      reader.readAsDataURL(file)
    })
  }

  handleUpload = () => {
    const {sendNotification, path} = this.props
    this.state.files.forEach(({file}) => {
      const fileName = file.name
      file.name = `${moment().format("YYYYMMDDhhmmss")}_${file.name.replace(/[\s:áéíóöőúüű|&;$%@"<>()+,]/g, "")}`
      FileStore
        .ref(toRoute("galleries", path, file.name))
        .put(file)
        .on("state_changed", ({bytesTransferred}) => {
          this.setState(({bytesUploaded}) => ({bytesUploaded: bytesUploaded + bytesTransferred}))
        }, () => {
          sendNotification({
            code: "error",
            message: `Sikertelen feltöltés. ${fileName} nem lett feltöltve.`
          })
        }, () => {
          sendNotification({
            code: "success",
            message: `${fileName} néhány másodperc múlva megjelenik a galériában.`
          }, 8000)
          this.reset()
        }
        )
    })
  }

  handleClose = () => {
    const {history, path} = this.props
    history.push(path)
  }


  reset = () => {
    this.handleClose()
    this.setState({files: [], bytesToUpload: 0, bytesUploaded: 0})
  }

  render() {
    const {files, style, bytesToUpload, bytesUploaded} = this.state
    const {path} = this.props

    const progress = Math.round(100 * bytesUploaded/bytesToUpload) || 0


    return (
      <Grid
        alignItems="flex-end"
        container
        direction="column"
        justify="flex-end"
        style={{position: "relative"}}
      >
        <Route
          path={toRoute(path, routes.UPLOAD)}
          render={() =>
            <Modal
              afterClose={this.reset}
              error="Hiba. A képeket nem sikerült feltölteni."
              fullWidth
              onSubmit={this.handleUpload}
              remainOpen
              shouldPrompt
              submitLabel="Feltöltés"
              success="A képek feltöltése elkezdődött..."
              title="Új képek feltöltése"
            >
              <Grid
                container
                direction="column"
                spacing={16}
              >
                <Grid item>
                  <Tooltip title="Válassza ki a feltölteni kívánt képeket">
                    <Input
                      disableUnderline
                      fullWidth
                      id="file"
                      inputProps={{
                        accept:".JPG, .JPEG, .jpg, .jpeg, .PNG, .png",
                        multiple: true
                      }}
                      name="file"
                      onChange={this.handleChange}
                      startAdornment={<InputAdornment position="start"><Upload color="disabled"/></InputAdornment>}
                      style={{padding: 8}}
                      type="file"
                      value=""
                    />
                  </Tooltip>
                </Grid>
                <Grid item>
                  <Tooltip title={`${progress}% feltöltve`}>
                    <LinearProgress
                      value={progress}
                      variant="determinate"
                    />
                  </Tooltip>
                </Grid>
                <Grid item>
                  <GridList
                    cols={3}
                  >
                    {files.map(({
                      file: {name}, src
                    }) =>
                      <GridListTile
                        key={name}
                      >
                        <img
                          alt={name}
                          {...{src}}
                        />
                        <GridListTileBar
                          actionIcon={
                            <Tooltip title="Kép törlése">
                              <IconButton
                                onClick={() => this.handleDelete(name)}
                                style={{color: "white"}}
                              >
                                <Cancel/>
                              </IconButton>
                            </Tooltip>

                          }
                          title={name}
                        />

                      </GridListTile>
                    )}
                  </GridList>
                </Grid>
                <Grid item><Tip>Egyszerre több kép is feltölthető.</Tip></Grid>
              </Grid>
            </Modal>
          }
        />
        <UploadFAB
          {...{
            path,
            style
          }}
        />
      </Grid>
    )
  }
}


const UploadFAB = ({
  path, style
}) =>
  <Tooltip
    title="Új képek feltöltése"
  >
    <Fab
      color="secondary"
      component={Link}
      style={style}
      to={toRoute(path, routes.UPLOAD)}
      variant="round"
    >
      <Upload/>
    </Fab>
  </Tooltip>

UploadFAB.propTypes = {
  path: PropTypes.string,
  style: PropTypes.object
}

export default withStore(UploadPictures)

