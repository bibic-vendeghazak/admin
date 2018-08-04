import React from "react"
import {Link} from "react-router-dom"
import {SortableContainer, SortableElement} from "react-sortable-hoc"
import {EDIT} from "../../../utils/routes"
import Edit from "material-ui/svg-icons/image/edit"
import {GridTile} from "material-ui"

export const SortableItem = SortableElement(({
  value: [
    key, {
      fileName, SIZE_360
    }
  ], baseURL
}) =>
  <GridTile
    actionIcon={
      <Link
        title="Szerkesztés"
        to={`${baseURL}/${key}/${EDIT}`}
      >
        <Edit
          color="white"
          style={{padding: ".5em"}}
        />
      </Link>
    }
    style={{
      position: "relative",
      cursor: "grabbing	",
      width: 140,
      height: 140,
      margin: ".5em",
      overflow: "hidden"
    }}
    title={fileName}
  >
    <img
      alt={fileName}
      height="100%"
      src={SIZE_360}
    />
  </GridTile>
)
export const SortableList = SortableContainer(({
  items, baseURL
}) =>
  <ul
    style={{
      display: "flex",
      flexWrap: "wrap"
    }}
  >
    {items.map((value, index) =>
      <SortableItem
        key={index}
        {...{
          index,
          value,
          baseURL
        }}
      />
    )}
  </ul>
)