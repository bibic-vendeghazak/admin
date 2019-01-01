import React from "react"
import Sortable from "../Sortable"
import Upload from "./Upload"
import GalleryItemEdit from "./GalleryItemEdit"
import GalleryItem from "./GalleryItem"
import {Paper} from "@material-ui/core"
import {Tip} from ".."

const Gallery = props =>
  <>
    <Paper style={{padding: "8px 16px"}}>
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
  </>

export default Gallery