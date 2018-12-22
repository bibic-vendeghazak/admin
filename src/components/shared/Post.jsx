import React, {Component} from "react"

import {
  Card,
  CardActions,
  CardHeader,
  CardContent,
  Button
} from "@material-ui/core"


export default class Post extends Component {

  state = {expandState: false}

  handleExpandState = () =>
    this.setState(({expandState}) => ({expandState: !expandState}))

  render() {
    const {
      expanded, title, subtitle, rightText, primaryButtonLabel, primaryButtonClick, primaryButtonDisabled, secondaryButtonLabel, secondaryButtonClick, secondaryButtonDisabled, children
    } = this.props
    const {expandState} = this.state
    return	(
      <Card expanded={expandState || expanded} >
        <CardHeader
          onClick={this.handleExpandState}
          style={{cursor: "pointer"}}
          {...{
            title,
            subtitle
          }}
          showExpandableButton
        >{rightText}</CardHeader>
        {(primaryButtonLabel || secondaryButtonLabel) &&
        <CardActions>
          {primaryButtonLabel &&
            <Button
              color="primary"
              disabled={primaryButtonDisabled}
              onClick={primaryButtonClick}
              variant="contained"
            >
              {primaryButtonLabel}
            </Button>
          }
          {secondaryButtonLabel &&
            <Button
              color="secondary"
              disabled={secondaryButtonDisabled}
              onClick={secondaryButtonClick}
              variant="contained"
            >
              {secondaryButtonLabel}
            </Button>
          }
        </CardActions>
        }
        <CardContent expandable>{children}</CardContent>
      </Card>
    )}
}
