import React from 'react'
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card'
import RaisedButton from 'material-ui/RaisedButton'
import Badge from 'material-ui/Badge'

export const ExpandableCard = ({title, subtitle, primaryButtonLabel, primaryButtonClick, primaryButtonDisabled, secondaryButtonLabel, secondaryButtonClick, secondaryButtonDisabled, content, children}) => (
  <Card>
    <CardHeader
      title={title}
      subtitle={subtitle}
      actAsExpander showExpandableButton
    />
    {(primaryButtonLabel || secondaryButtonLabel) &&
    <CardActions>
        {primaryButtonLabel &&
        <RaisedButton 
            primary
            onClick={() => primaryButtonClick()}
            disabled={primaryButtonDisabled}
            label={primaryButtonLabel}
        />
      }
      {secondaryButtonLabel &&
        <RaisedButton 
            secondary
            onClick={() => secondaryButtonClick()}
            disabled={secondaryButtonDisabled}
            label={secondaryButtonLabel}
        />
      }
    </CardActions>
    }
    <CardText expandable>{content ? content : children}</CardText>
  </Card>
)

export const TabLabel = ({title, count}) => (
  <div style={{display:"flex", alignItems: "center"}}>
    <div>{title}</div>
    <Badge style={{marginLeft: 12, padding: 12}} primary badgeContent={count}/>
  </div>
)