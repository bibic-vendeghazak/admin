import React from "react"
import {Link} from "react-router-dom"
import {SortableContainer, SortableElement} from "react-sortable-hoc"
import {EDIT} from "../../../utils/routes"
import Edit from "material-ui/svg-icons/image/edit"
import {
  Paper,
  FloatingActionButton
} from "material-ui"

export const SortableItem = SortableElement(({
  value: [
    key, {
      fileName, SIZE_360
    }
  ], baseURL
}) =>
  <Paper
    circle
    style={{
      position: "relative",
      cursor: "grabbing	",
      width: 140,
      height: 140,
      margin: ".5em",
      overflow: "hidden",
      userSelect: "none",
      display: "grid",
      justifyItems: "center",
      alignItems: "center"
    }}
    zDepth={2}
  >
    <img
      alt={fileName}
      height="100%"
      src={SIZE_360}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none"
      }}
    />
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,.18)"
      }}
    />
    <Link
      title="Szerkesztés"
      to={`${baseURL}/${key}/${EDIT}`}
    >
      <FloatingActionButton mini><Edit/></FloatingActionButton>
    </Link>
  </Paper>
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