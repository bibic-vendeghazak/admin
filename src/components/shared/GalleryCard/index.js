import React, { Component, Fragment } from "react"
import {Route, Link} from "react-router-dom"
import {Card, RaisedButton, Paper, Subheader} from "material-ui"
import {Section} from ".."
import CircularProgress from "material-ui/CircularProgress"
import { EDIT } from "../../../utils/routes"
import CardMedia from "material-ui/Card/CardMedia"
import CardText from "material-ui/Card/CardText"
import TextField from "material-ui/TextField/TextField"
import CardActions from "material-ui/Card/CardActions"
import Save from "material-ui/svg-icons/content/save"
import Cancel from "material-ui/svg-icons/navigation/cancel"
import Delete from "material-ui/svg-icons/action/delete"
import Rearrange from "material-ui/svg-icons/editor/format-list-numbered"
import Upload from "./Upload"

import {arrayMove} from "react-sortable-hoc"
import { DB } from "../../../utils/firebase"

import {SortableList} from "./Sort"



class Gallery extends Component {
	state = {
		pictures: [],
		isChanged: false,
		isTimedOut: true
	}
	
	componentDidMount() {
  	DB
			.ref(`${this.props.path}/pictures`)
			.orderByChild("order")
			.on("child_added", snap => {
				this.setState(({pictures}) => ({
					pictures: [
						...pictures, [snap.key,snap.val()]
					]
				}))
			})
		//REVIEW: Find a better way of showing "empty" when no picture.
		setTimeout(() => this.setState({isTimedOut: false}), 5000)
	}
	
	handleSort = ({oldIndex, newIndex}) => {
  	this.setState(({pictures}) => ({
			pictures: arrayMove(pictures, oldIndex, newIndex),
			isChanged: true
  	}))
	}
	
	handleSortSave = () => {
		const {pictures} = this.state
		if (pictures.length) {
			Promise.all(
				pictures.map(([pictureId, rest], index) =>
					DB.ref(`${this.props.path}/pictures/${pictureId}`)
						.set({
							...rest,
							order: index
						})
				))
				//TODO: Inform user by notification
				.then(() => {
					this.setState({isChanged: false})
					console.log("Saved")
				})
				.catch(console.error)
		}
	}

	render() { 
  	const {pictures, isChanged, isTimedOut} = this.state
		const {baseURL, path} = this.props
		
  	return ( 
  		<div style={{margin: "1.5%"}}>
  			<Route exact 
  				path={`${baseURL}/:galleryItemId/${EDIT}`}
  				render={({match, history}) => 
						<GalleryItemEdit {...{history, match, path, baseURL}}/>
					}
				/>

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
							<RaisedButton
								disabled={!isChanged}
								label="Sorrend mentése"
								icon={<Rearrange/>}
								onClick={this.handleSortSave}
							/>
							<SortableList
								useWindowAsScrollContainer
								axis="xy"
								baseURL={baseURL}
								items={pictures}
								onSortEnd={this.handleSort}/>
						</div> :
						!isTimedOut ?
							<Subheader style={{textAlign: "center"}}>Üres</Subheader> :
							<CircularProgress/>
					}
  				</Paper>
				<Upload {...{path}}/>
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
  	const {path, match: {params: {galleryItemId}}} = this.props
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
		const {baseURL, path, history, match: {params: {galleryItemId}}} = this.props
		const pathRef= DB.ref(path)
		Promise.all([
			pathRef.child(`metadata/${galleryItemId}`).remove(),
			pathRef.child(`pictures/${galleryItemId}`).remove()
		])
			.then(() => history.push(baseURL))
			.catch(console.error)
	}
		
		handleSubmitText = () => {
			const {baseURL, path, history, match: {params: {galleryItemId}}} = this.props
			const {title, desc} = this.state
			DB
				.ref(`${path}/metadata/${galleryItemId}`)
				.update({title, desc})
				.then(() => history.push(baseURL))
				.catch(console.error)
		}

	handleTextChange = ({target: {name, value}}) => this.setState({[name]: value})

	render() {
  	const {title, desc, picture: {SIZE_640}} = this.state
		const {baseURL} = this.props
		
  	return (
  		<Section>
  			<Card>
  				<CardMedia>
						<img alt={title} src={SIZE_640}/>
  				</CardMedia>
  				<CardText>
						<TextField 
							name="title"
							floatingLabelText="Kép címe"
							multiLine
							fullWidth
							value={title}
							onChange={this.handleTextChange}
						/>
						<TextField 
							name="desc"
							floatingLabelText="Kép leírása"
							multiLine
							fullWidth
							value={desc}
							onChange={this.handleTextChange}
						/>
  				</CardText>
  				<CardActions> 
  					<div>
  						<RaisedButton
  							secondary
  							labelPosition="before"
  							icon={<Delete/>}
  							label="Törlés"
  							onClick={this.handleDeleteGalleryItem}
  						/>
  						<Link to={baseURL}>
  							<RaisedButton
  								style={{margin: 12}}
  								icon={<Cancel/>}
  								labelPosition="before"
  								label="Mégse"
  							/>
  						</Link>
  						<RaisedButton
  							primary
  							labelPosition="before"
  							icon={<Save/>}
  							label="Mentés"
  							onClick={this.handleSubmitText}
  						/>
  					</div>
  			  </CardActions>
  			</Card>
  		</Section>
  	)
	}
}