import React, {Component} from "react"
import {Link} from "react-router-dom"
import styled from "styled-components"

import {
  CircularProgress,
  Card,
  CardActions,
  CardHeader,
  CardText,
  RaisedButton,
  FlatButton,
  Badge,
  Dialog,
  Subheader
} from "material-ui"


import Empty from 'material-ui/svg-icons/action/find-in-page'
import Help from 'material-ui/svg-icons/action/help'

export class Post extends Component {

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
            <RaisedButton
              disabled={primaryButtonDisabled}
              label={primaryButtonLabel}
              onClick={primaryButtonClick}
              primary
            />
          }
          {secondaryButtonLabel &&
            <RaisedButton
              disabled={secondaryButtonDisabled}
              label={secondaryButtonLabel}
              onClick={secondaryButtonClick}
              secondary
            />
          }
        </CardActions>
        }
        <CardText expandable>{children}</CardText>
      </Card>
    )}
}

export const TabLabel = ({
  title, to, count=0
}) => (
  <Link
    {...{to}}
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
    <div style={{
      display:"flex",
      alignItems: "center"
    }}
    >
      <div>{title}</div>
      <Badge
        badgeContent={count}
        primary
        style={{
          marginLeft: 12,
          padding: 12
        }}
      />
    </div>
  </Link>
)


export const PlaceholderText = ({children}) => (
  <div
    style={{
      paddingTop: "5%",
      textAlign: "center"
    }}
  >
    <h2>{children}</h2>
  </div>
)


export const ModalDialog = props => {
  const {
    cancelLabel, onCancel, submitLabel, onSubmit, onSubmitDisabled, children
  } = props
  return (
    <Dialog
      actions={[
        <FlatButton
          label={cancelLabel ? cancelLabel : "Mégse"}
          onClick={onCancel}
          primary
          style={{marginRight: 12}}
        />,
        <RaisedButton
          disabled={onSubmitDisabled}
          label={submitLabel ? submitLabel : "Igen"}
          onClick={onSubmit}
          secondary
        />
      ]}
      modal
      {...{...props}}
    >
      {children}
    </Dialog>
  )
}

export const Tip = ({children}) =>
  <div
    style={{
      margin: "2.5%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}
  >
    <Help color="grey"/>
    <Subheader
      style={{
        fontFamily: "sans-serif",
        fontStyle: "italic",
        fontSize: 12
      }}
    >
      Tipp: {children}
    </Subheader>
  </div>

export const Loading = ({isEmpty=false}) =>
  <Section>
    {
      isEmpty ?
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <p style={{color: "grey"}}>üres</p>
          <Empty color="grey"/>
        </div> :
        <CircularProgress/>
    }
  </Section>

export const Section = styled("div")`
  position: relative
  max-width: 720px
  margin: 0 auto
  display: flex
  align-items: center
  flex-direction: column
  justify-content: center
  @media(min-width: 640px) {
    margin: 2.5em auto
  }
`