import React from "react"

import {Card, CardActions, CardHeader, CardText} from "material-ui/Card"
import RaisedButton from "material-ui/RaisedButton"
import FlatButton from "material-ui/FlatButton"
import Badge from "material-ui/Badge"
import Dialog from "material-ui/Dialog"

export const Post = ({title, subtitle, rightText, primaryButtonLabel, primaryButtonClick, primaryButtonDisabled, secondaryButtonLabel, secondaryButtonClick, secondaryButtonDisabled, children}) => (
	<Card>
		<CardHeader
			{...{title, subtitle}} actAsExpander showExpandableButton>{rightText}</CardHeader>
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
)

export const TabLabel = ({title, count}) => (
	<div style={{display:"flex", alignItems: "center"}}>
		<div>{title}</div>
		<Badge style={{marginLeft: 12, padding: 12}} primary badgeContent={count}/>
	</div>
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