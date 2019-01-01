import React from "react"
import Paragraph from "./Paragraph"
import Sortable from "../Sortable"
import NewParagraph from "./NewParagraph"
import Tip from "../Tip"

const Paragraphs = props =>
  <>
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
    <Tip>
      A sorrendet &quot;fogd és vidd&quot; módszerrel lehet változtatni.
      A változtatások automatikusan mentésre kerülnek.
    </Tip>
  </>

export default Paragraphs

