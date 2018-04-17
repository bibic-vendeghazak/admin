import React, {Component} from 'react'
import firebase from 'firebase'

import IconButton from 'material-ui/IconButton'
import Delete from 'material-ui/svg-icons/action/delete'
import Upload from 'material-ui/svg-icons/file/file-upload'
import Progress from 'material-ui/LinearProgress'
import Card, { CardActions } from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField/TextField'
import { colors } from '../../../utils';
import { CircularProgress } from 'material-ui';

export default class Pictures extends Component {
  
  state = {
    isEditing: false,
    progress: 0,
    pictures: null
  }

  componentDidMount() {
    const roomId = this.props.roomId - 1
    firebase.database()
    .ref(`rooms/${roomId}/pictures`)
    .once("value", snap => {
      const pictures = []
      snap.forEach(picture => {
        pictures.push( {
          fileName: picture.val().name,
          url: picture.val().resized
        })
      })
      this.setState({pictures})
    })
  }
  
  handleSave = () => {
    this.handleCloseEdit()
  }
  
  handleFileChange = e => {
    const roomId = this.props.roomId - 1
    const file = e.target.files[0]    

    firebase.storage()
      .ref(`photos/rooms/${roomId}/${file.name}`)
      .put(file).on("state_changed",
        snap => {
          this.setState({
            progress: 100 * (snap.bytesTransferred / snap.totalBytes)
          })
        },
        err => console.log(err),
        () => console.log("Done")
      )
  }

  handleOpenEdit = () => this.setState({isEditing: true})
  handleCloseEdit = () => this.setState({isEditing: false})

  
  render() {
    const {isEditing, progress, pictures} = this.state
    return (
      <Card className="room-edit-block">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1em"
          }}
        >
        
        {isEditing ?

          <div><Progress  mode="determinate"  value={progress}/>
          </div> :
          <div 
          style={{
              flexGrow: 1,
              display: "flex",
              flexWrap: "wrap",
              justifyContent: !pictures && "center",
              alignItems: pictures ? "flex-start" : "center",
              minHeight: 120
            }}
            >
            {pictures &&
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  border: "4px dashed grey",
                  width: 140,
                  height: 112
                }}
              >
                <input type="file" name="file" value="" onChange={this.handleFileChange} id="file" className="inputfile" />
                <label title="Kép feltöltése" className="file-label" htmlFor="file"><Upload color="grey"/></label>
              </div>

            }
          {pictures ? pictures.map(({url, fileName}) => (
            <Picture key={fileName} {...{fileName}} roomId={this.props.roomId} src={url}/>
          )) :
            <CircularProgress/>
          }
        </div>
        }

        </div>
        <CardActions style={{display: "flex", justifyContent: "flex-end"}}> 
          {isEditing ?
            <RaisedButton
              secondary
              label={"OK"}
              onClick={this.handleCloseEdit}
            /> :
            <RaisedButton
              secondary
              label={"Feltöltés"}
              onClick={this.handleOpenEdit}
            />
          }
        </CardActions>
      </Card>
  )
  }
}


class Picture extends Component {
  state = {
    isEditing: false
  }

  handleClick = () => this.setState(({isEditing})=> ({
    isEditing: !isEditing
  }))

  handleDeletePicture = () => {
    const picturesRef = firebase.database()
    .ref(`rooms/${this.props.roomId-1}/pictures`)

    firebase.storage()
      .ref(`photos/rooms/${this.props.roomId-1}/${this.props.fileName}`)
      .delete().then(() => {
        picturesRef.once("value", snap => {
            snap.forEach(picture => {
              if (picture.val() === this.props.fileName) {
                picturesRef.child(picture.key).remove()
              }
            })
          })
      })

  }

  render() {
    const {isEditing} = this.state
    const {src} = this.props
    return (
      <div 
        className="picture"
        onClick={this.handleClick}
      >
        {
          isEditing ?
          <div className="edit">
            <IconButton 
              onClick={this.handleDeletePicture}
              tooltip="Kép törlése">
              <Delete color={colors.red} />
            </IconButton>
          </div> :
          <div className="hover">
            <span>
              {this.props.fileName}
            </span>
          </div>
        }
        <img {...{src}}/>
      </div>
    )
  }
}