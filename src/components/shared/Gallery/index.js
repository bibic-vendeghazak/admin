import React from "react"
import Sortable from "../Sortable"
import Upload from "./Upload"
import GalleryItemEdit from "./GalleryItemEdit"
import GalleryItem from "./GalleryItem"
import {Paper} from "@material-ui/core"

const Gallery = props =>
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

export default Gallery