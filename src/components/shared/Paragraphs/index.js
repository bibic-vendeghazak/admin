import React from "react"
import Paragraph from "./Paragraph"
import Sortable from "../Sortable"
import NewParagraph from "./NewParagraph"
import Tip from "../Tip"

const Paragraphs = props =>
  <div style={{maxWidth: 4*140+5*16, margin: "16px auto 0"}}>
    <Sortable
      actionComponent={NewParagraph}
      axis="y"
      containerProps={{direction: "column"}}
      editItemComponent={Paragraph}
      folder="paragraphs"
      sortableItemComponent={Paragraph}
      useDragHandle
      {...props}
    />
    <Tip>
      A sorrendet &quot;fogd és vidd&quot; módszerrel lehet változtatni.
      A változtatások automatikusan mentésre kerülnek.
    </Tip>
  </div>

export default Paragraphs

