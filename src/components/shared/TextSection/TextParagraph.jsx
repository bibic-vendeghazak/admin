import React, {Component, Fragment} from "react"
import {PARAGRAPHS_DB} from "../../../utils/firebase"

import firebase from "firebase"


import Card, { CardActions } from "material-ui/Card"
import RaisedButton from "material-ui/RaisedButton"
import TextField from "material-ui/TextField/TextField"
import Edit from "material-ui/svg-icons/image/edit"
import Delete from "material-ui/svg-icons/action/delete"
import Save from "material-ui/svg-icons/content/save"
import Cancel from "material-ui/svg-icons/navigation/cancel"
import styled from "styled-components"

export default class TextParagraph extends Component {

  state = {
  	text: null,
  	isEditing: false
  }


  handleOpenEdit = () => this.setState({isEditing: true})

  handleCloseEdit = () => this.setState({isEditing: false})
  handleTextChange = ({target: {value: text}}) => this.setState({text})


	handleSubmitText = () => 
		PARAGRAPHS_DB.child(this.props.path)
			.update({
				text: this.state.text
			})
			.then(this.handleCloseEdit)

	handleDeleteParagraph = () => PARAGRAPHS_DB.child(this.props.path).remove()
  
	render() {
  	const {text, isEditing} = this.state
    
  	return (
  		<Wrapper>
  			<div
  				style={{
  					display: "flex",
  					justifyContent: "space-between",
  					alignItems: "center",
  					padding: "1em"
  				}}
  			>
  				{isEditing ?
  					<TextField
  						id="text"
  						floatingLabelText="bekezdés szövege"
  						fullWidth
							multiLine
							// REVIEW: Seems to be a hacky solution. Try something else...? 
  						value={text || this.props.text}
  						onChange={this.handleTextChange}
  					/> :
  					<p style={{cursor: "pointer", userSelect: "none"}} onClick={this.handleOpenEdit}>{this.props.text || "Üres"}</p>
  				}

  			</div>
  			<CardActions> 
  				{isEditing ?
  					<div>
  						<RaisedButton
  							style={{margin: 12}}
  							icon={<Cancel/>}
  							labelPosition="before"
  							label={"Mégse"}
  							onClick={this.handleCloseEdit}
  						/>
  						<RaisedButton
  							secondary
  							labelPosition="before"
  							icon={<Save/>}
  							label={"Mentés"}
  							onClick={this.handleSubmitText}
  						/>
  					</div> :
  					<Fragment>
  						<RaisedButton
  							style={{margin: "0 12px"}}
  							label={window.innerWidth >= 640 && "Módosít"}
  							icon={<Edit/>}
  							labelPosition="before"
  							onClick={this.handleOpenEdit}
  						/>
  						<RaisedButton
  							secondary
  							label={window.innerWidth >= 640 && "Törlés"}
  							icon={<Delete/>}
  							labelPosition="before"
  							onClick={this.handleDeleteParagraph}
  						/>
  					</Fragment>
  				}
  			</CardActions>
  		</Wrapper>
  	)
	}
}

const Wrapper = styled(Card)`
	cursor: grabbing
	margin-bottom: 2.5em
`