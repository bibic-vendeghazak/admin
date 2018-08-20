import React from "react"
import Paragraph from "./Paragraph"
import Sortable from "../Sortable"
import NewParagraph from "./NewParagraph"

const Paragraphs = props =>
  <Sortable
    actionComponent={NewParagraph}
    axis="y"
    containerProps={{direction: "column"}}
    editItemComponent={Paragraph}
    folder="paragraphs"
    itemProps={{style: {
      margin: "0 auto",
      maxWidth: 540
    }}}
    sortableItemComponent={Paragraph}
    useDragHandle
    {...props}
  />

export default Paragraphs

