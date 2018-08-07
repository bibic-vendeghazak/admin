import React, {Component} from "react"
import {arrayMove} from "react-sortable-hoc"
import {PARAGRAPHS_DB} from "../../../utils/firebase"
import {Section, Loading, Tip} from ".."
import {SortableList} from "./Sort"

import {
  FloatingActionButton
} from "material-ui"

import Plus from "material-ui/svg-icons/content/add"


export default class TextSection extends Component {
  state = {
    paragraphs: [],
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
    if (paragraphs.length) {
      Promise
        .all(
          arrayMove(paragraphs, oldIndex, newIndex).map(([paragraphId], index) =>
            PARAGRAPHS_DB.child(`${this.props.path}/${paragraphId}`)
              .update({order: index})
          ))
        //TODO: Inform user by notification
        .then(() => console.log("Saved"))
        .catch(console.error)
    }
  }

  handleCreateNewParagraph = () =>
    PARAGRAPHS_DB.child(this.props.path)
      .push({
        text: "",
        order: -1
      })

  render() {
    const {path} = this.props
    const {
      paragraphs, isEmpty
    } = this.state
    return (
      <Section>
        <Tip>
          A sorrendet "fogd és vidd" módszerrel lehet változtatni. A változtatások automatikusan mentésre kerülnek.
        </Tip>
        {paragraphs.length ?
          <SortableList
            distance={10}
            items={paragraphs}
            onSortEnd={this.handleSort}
            path={path}
          /> :
          <Loading isEmpty={isEmpty}/>
        }
        <FloatingActionButton
          onClick={this.handleCreateNewParagraph}
          secondary
          style={{
            position: "fixed",
            right: 32,
            bottom: 32
          }}
          title="Új bekezdés hozzáadása"
        >
          <Plus/>
        </FloatingActionButton>
      </Section>
    )
  }
}
