import React, { Component } from "react"
import { PARAGRAPHS_DB } from "../../../utils/firebase"
import { RaisedButton, Subheader, CircularProgress, FloatingActionButton } from "material-ui"
import Plus from "material-ui/svg-icons/content/add"
import {Section} from "../index"
import Rearrange from "material-ui/svg-icons/editor/format-list-numbered"

import {arrayMove} from "react-sortable-hoc"
import {SortableList} from "./Sort"

export default class TextSection extends Component {
	state = {
		paragraphs: []
	}
	
	// REVIEW: Sorting on client. Does it scale?
	componentDidMount() {
		PARAGRAPHS_DB.child(this.props.path)
			.on("value", snap => {
				const paragraphs =  Object.entries(snap.val())
					.sort((a, b) => a[1].order - b[1].order)
				this.setState({
					paragraphs
				})
			})
	}


	handleSort = ({oldIndex, newIndex}) => {
  	this.setState(({paragraphs}) => ({
			paragraphs: arrayMove(paragraphs, oldIndex, newIndex)
		}))
	}

	handleSortSave = () => {
		const {paragraphs} = this.state
		if (paragraphs.length) {
			Promise.all(
				paragraphs.map(([paragraphId], index) =>
					PARAGRAPHS_DB.child(`${this.props.path}/${paragraphId}`)
						.update({order: index})
				))
				//TODO: Inform user by notification
				.then(() => {
					console.log("Saved")
				})
				.catch(console.error)
		}
	}


	createNewParagraph = () =>
		PARAGRAPHS_DB.child(this.props.path)
			.push({
				text: "",
				order: -1
			})

	render() {
		const {path, title} = this.props
		const {paragraphs} = this.state
  	return ( 
  		<Section>
				<RaisedButton
					label="Sorrend mentése"
					icon={<Rearrange/>}
					onClick={this.handleSortSave}
				/>
				<Subheader style={{paddingLeft: 0, textAlign: "center"}}>{title}</Subheader>
				{paragraphs.length ? 
					<SortableList
						path={path}
						items={paragraphs}
						onSortEnd={this.handleSort}
					/> :
					 <div 
					 	style={{
							 display: "flex",
							 justifyContent:"center",
							 margin: "2.5vw"
							 }}
					>
							 <CircularProgress/>
					 </div>
				}
				<FloatingActionButton mini secondary 
					title="Új bekezdés" 
					style={{position: "absolute", right: 16, bottom: 16}}
					onClick={this.createNewParagraph}
				>
					<Plus/>
				</FloatingActionButton>
  		</Section>
  	)
	}
}
 