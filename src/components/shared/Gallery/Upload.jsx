import React, {Component} from "react"
import {Route, Link} from "react-router-dom"

import {routes, toRoute} from "../../../utils"
import {FileStore} from "../../../utils/firebase"
import {Tip, Modal} from ".."
import {Grid, Button, Tooltip, GridList, GridListTile, GridListTileBar, IconButton, LinearProgress, Input, InputAdornment} from "@material-ui/core"

import Upload from "@material-ui/icons/CloudUploadRounded"
import Cancel from '@material-ui/icons/CloseRounded'
import {withStore} from "../../App/Store"

class UploadPictures extends Component {

  state = {
    finished: {},
    filesToUpload: [],
    finishedCount: 0
  }

  componentDidUpdate() {
    const {
      filesToUpload, finishedCount
    } = this.state
    if (filesToUpload.length !== 0 && filesToUpload.length === finishedCount) {
      this.setState(() => ({
        finishedCount: 0,
        filesToUpload: [],
        finished: {}
      }), this.handleClose)
    }
  }


  handleDelete = name =>
    this.setState(({filesToUpload}) => ({filesToUpload: filesToUpload.filter(({file: {name: fileName}}) => name !== fileName)}))

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

  handleUpload = () =>
    Promise.all(
      this.state.filesToUpload.map(({file}) =>
        FileStore
          .ref(toRoute("galleries", this.props.path, file.name))
          .put(file)
          .on("state_changed", ({bytesTransferred}) => {
            this.setState(({finished}) => ({finished: {
              ...finished,
              [file.name] : bytesTransferred
            }}))
          }, () => {
            this.props.sendNotification({
              code: "error",
              message: `Sikertelen feltöltés. ${file.name} nem lett feltöltve.`
            })
          }, () => {
            this.props.sendNotification({
              code: "success",
              message: `${file.name} néhány másodperc múlva megjelenik a galériában.`
            })
            this.setState(({finishedCount}) => ({finishedCount: finishedCount+1}))
          }
          )
      ))


  handleClose = () => this.props.history.goBack()


  render() {
    const {filesToUpload} = this.state
    const {
      path, relativeFAB
    } = this.props
    let {finished} = this.state
    finished = Object.values(finished).reduce((acc, size) => acc+size, 0)
    const remaining = filesToUpload.reduce((acc, {file: {size}}) => acc+size, 0)
    const progress = Math.round(100 * finished/remaining) || 0


    const style = relativeFAB ? {
      position: "relative",
      zIndex: 1000
    } : {
      position: "fixed",
      right: 32,
      bottom: 32,
      zIndex: 1000
    }

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
                    {filesToUpload.map(({
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
    <Button
      color="secondary"
      component={Link}
      style={style}
      to={toRoute(path, routes.UPLOAD)}
      variant="fab"
    >
      <Upload/>
    </Button>
  </Tooltip>


export default withStore(UploadPictures)

