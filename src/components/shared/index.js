import React, {Component} from "react"
import {Card, CardActions, CardHeader, CardText} from "material-ui/Card"
import RaisedButton from "material-ui/RaisedButton"
import FlatButton from "material-ui/FlatButton"
import Badge from "material-ui/Badge"
import Dialog from "material-ui/Dialog"
import Link from "react-router-dom/Link"
import styled from "styled-components"

export class Post extends Component {

	state = {
		expandState: false
	}

	toggleExpandState = () => 
		this.setState(({expandState}) => ({expandState: !expandState}))

	render() {
		const {expanded, title, subtitle, rightText, primaryButtonLabel, primaryButtonClick, primaryButtonDisabled, secondaryButtonLabel, secondaryButtonClick, secondaryButtonDisabled, children} = this.props
		const {expandState} = this.state
		return	(
			<Card expanded={expandState || expanded} >
				<CardHeader
					style={{cursor: "pointer"}}
					onClick={this.toggleExpandState}
					{...{title, subtitle}} showExpandableButton>{rightText}</CardHeader>
				{(primaryButtonLabel || secondaryButtonLabel) &&
				<CardActions>
					{primaryButtonLabel &&
						<RaisedButton 
							primary
							onClick={primaryButtonClick}
							disabled={primaryButtonDisabled}
							label={primaryButtonLabel}
						/>
					}
					{secondaryButtonLabel &&
						<RaisedButton 
							secondary
							onClick={secondaryButtonClick}
							disabled={secondaryButtonDisabled}
							label={secondaryButtonLabel}
						/>
					}
				</CardActions>
				}
				<CardText expandable>{children}</CardText>
			</Card>
		)}
}

export const TabLabel = ({title, to, count=0}) => (
	<Link {...{to}} 
		style={{
			color: "white",
			textDecoration: "none",
			flex: 1,
			minWidth: "100%",
			display: "flex",
			alignItems: "center",
			justifyContent: "center"
		}}
	>
		<div style={{display:"flex", alignItems: "center"}}>
			<div>{title}</div>
			<Badge style={{marginLeft: 12, padding: 12}} primary badgeContent={count}/>
		</div>
	</Link>
)


export const PlaceholderText = ({children}) => (
	<div 
		style={{
			paddingTop: "5%",
			textAlign: "center"
		}}>
		<h2>{children}</h2>
	</div>
)


export const ModalDialog = props => {
	const {cancelLabel, onCancel, submitLabel, onSubmit, onSubmitDisabled, children} = props
	return (
		<Dialog modal
			actions={[
				<FlatButton
					style={{marginRight: 12}}
					label={cancelLabel ? cancelLabel : "Mégse"}
					primary
					onClick={onCancel}
				/>,
				<RaisedButton
					disabled={onSubmitDisabled}
					label={submitLabel ? submitLabel : "Igen"}
					secondary
					onClick={onSubmit}
				/>
			]}
			{...{...props}}
		>
			{children}
		</Dialog>
	)
}

export const Section = styled("div")`
	position: relative
	max-width: 720px
	margin: 0 auto
	@media(min-width: 640px) {
		margin: 2.5em auto
	}
`