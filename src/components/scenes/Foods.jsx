import React from 'react'
import Sortable from '../shared/Sortable'
import Upload from '../shared/Gallery/Upload'
import GalleryItemEdit from '../shared/Gallery/GalleryItemEdit'
import GalleryItem from '../shared/Gallery/GalleryItem'
import { Gallery } from '../shared';

const Foods = props =>
  <Gallery  />
  <Sortable
    actionComponent={Upload}
    editItemComponent={GalleryItemEdit}
    folder="galleries"
    hasText
    sortableItemComponent={GalleryItem}
    {...props}
  />

export default Foods