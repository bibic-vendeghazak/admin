import React from "react"
import Sortable from "../Sortable"
import Upload from "./Upload"
import GalleryItemEdit from "./GalleryItemEdit"
import GalleryItem from "./GalleryItem"
import {Paper} from "@material-ui/core"
import {Tip} from ".."

const Gallery = props =>
  <div style={{maxWidth: 4*140+5*16, margin: "16px auto"}}>
    <Paper style={{padding: 16}}>
      <Sortable
        actionComponent={Upload}
        editItemComponent={GalleryItemEdit}
        folder="galleries"
        hasText={props.hasText !== false ? true : false}
        sortableItemComponent={GalleryItem}
        {...props}
      />
    </Paper>
    <Tip>
      A sorrendet &quot;fogd és vidd&quot; módszerrel lehet változtatni.
      A változtatások automatikusan mentésre kerülnek.
    </Tip>
  </div>

export default Gallery