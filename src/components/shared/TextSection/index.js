import React, {Component} from "react"
import {arrayMove} from "react-sortable-hoc"
import {PARAGRAPHS_DB} from "../../../utils/firebase"
import {Section, Loading, Tip} from ".."
import Sort from "../Sort"
import TextParagraph from "./TextParagraph"
import {Button} from "@material-ui/core"
import Add from '@material-ui/icons/ShortTextRounded'
import {withStore} from "../../App/Store"

class TextSection extends Component {
  state = {
    paragraphs: null,
    isEmpty: false
  }

  componentDidMount() {
    PARAGRAPHS_DB.child(this.props.path)
      .on("value", snap => {
        if (snap.exists()) {
          this.setState({paragraphs: Object
            .entries(snap.val())
            .sort((a, b) => a[1].order - b[1].order)})
        } else {
          this.setState({isEmpty: true})
        }
      })
  }

  handleSort = ({
    oldIndex, newIndex
  }) => {
    const {paragraphs} = this.state
    const {
      path, sendNotification
    } = this.props
    const newParagraphs = arrayMove(paragraphs, oldIndex, newIndex)
    if (paragraphs.toString() !== newParagraphs.toString()) {
      Promise
        .all(
          newParagraphs.map(([paragraphId], index) =>
            PARAGRAPHS_DB.child(`${path}/${paragraphId}`)
              .update({order: index})
              .catch(sendNotification)
          ))
        .then(() => sendNotification({
          code: "success",
          message: "Új sorrend mentve."
        }))
        .catch(sendNotification)
    }
  }


  handleCreateNewParagraph = () =>
    PARAGRAPHS_DB.child(this.props.path)
      .push({
        text: "",
        order: -1
      })
      .then(() => this.props.sendNotification({
        code: "success",
        message: "Új bekezdés hozzáadva"
      }))
      .catch(this.props.sendNotification)

  render() {
    const {
      paragraphs, isEmpty
    } = this.state

    return (
      <Section>
        {paragraphs ?
          <Sort
            component={TextParagraph}
            containerStyle={{direction: "column"}}
            distance={48}
            helperClass="sort-helper"
            items={paragraphs}
            onSortEnd={this.handleSort}
            path={this.props.path}
            useDragHandle
            useWindowAsScrollContainer
          /> :
          <Loading isEmpty={isEmpty}/>
        }
        <Button
          color="secondary"
          onClick={this.handleCreateNewParagraph}
          style={{
            position: "fixed",
            right: 32,
            bottom: 32
          }}
          variant="extendedFab"
        >
          <Add/>
          <span style={{marginLeft: 8}}>Új bekezdés</span>
        </Button>
        <Tip>
          A sorrendet "fogd és vidd" módszerrel lehet változtatni. A változtatások automatikusan mentésre kerülnek.
        </Tip>

      </Section>
    )
  }
}

export default withStore(TextSection)