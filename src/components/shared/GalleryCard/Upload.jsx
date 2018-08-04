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

  
  state = {
  	progress: 0,
  	filesToUpload: []
  }
	
	deletePictre = fileName =>
		this.setState(({filesToUpload}) => ({
			filesToUpload: filesToUpload.filter(fileToUpload => fileToUpload.file.name !== fileName)
		}))
  
  handleFileChange = e =>
  	Object.values(e.target.files).forEach(file => {
  		const reader = new FileReader()
  		reader.onloadend = () => {
  			this.setState(({filesToUpload}) => ({
  				filesToUpload: filesToUpload.concat({file, src: reader.result})
  			}))
  		}
  		reader.readAsDataURL(file)
  	})
  
  handleUpload = () => {
  	const {filesToUpload} = this.state
  	const {path} = this.props
  	Promise.all (
  		filesToUpload.map(fileToUpload => {
  			const uploadTask = firebase.storage()
  				.ref(`${path}/${fileToUpload.file.name}`)
  				.put(fileToUpload.file)
  		    uploadTask.on("state_changed",
  					snap => {
  					console.log(snap)
							
  						this.setState({
  							progress: 100 * (snap.bytesTransferred / snap.totalBytes)
  						})
  					},
  					console.error,
  					() => this.setState({progress: 0})
  				)

  		})
  	).then(() => this.setState({filesToUpload: []}))
  		.catch(e => {console.error(e)})
  }

  
  render() {
  	const {progress, filesToUpload} = this.state
  	return (
  		<Fragment>
  			<Subheader>Új képek feltöltése</Subheader>   
  		<Paper>
  			{progress ? <Progress mode="determinate" value={progress}/> : null}
  			<div className="pictures-container">
  			<div className="upload-picture">
  					<input 
  						accept=".JPG, .JPEG, .jpg, .jpeg, .PNG, .png"
  						type="file"
  						name="file"
  						value=""
  						onChange={this.handleFileChange} 
  						multiple
  						id="file"
  						className="inputfile" 
  					/>
  				<label title="Válassza ki a feltölteni kívánt képeket" className="file-label" htmlFor="file">
  					<Upload color="grey"/>
  				</label>
  			</div>
  			{filesToUpload.length ?
  					<Fragment>
  						{filesToUpload.map(({file: {name: fileName}, src}) => 
  							<Picture onClick={() => this.deletePictre(fileName)} key={fileName} {...{src}}/>     
  						)}
  					</Fragment> : null}
  			</div>
  			<CardActions> 
  				<RaisedButton
  					disabled={!filesToUpload.length}
  					secondary
  					label="Feltöltés"
  					onClick={this.handleUpload}
  				/>
  			</CardActions>
  		</Paper>
  		</Fragment>
  	)
  }
}


const Picture = ({onClick, src}) =>
	<div {...{onClick}} className="picture">
		<Close style={{position: "absolute", right: 0, margin: 16}} color="white"/>
		<img alt="" {...{src}}/>
	</div>

