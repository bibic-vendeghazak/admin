import React from "react"
import {SortableContainer, SortableElement} from "react-sortable-hoc"
import TextParagraph from "./TextParagraph"
import {Paper, List} from "material-ui"

export const SortableItem = SortableElement(({
  value: [key, {text}], path
}) =>
  <TextParagraph
    path={`${path}/${key}`}
    text={text}
  />
)

export const SortableList = SortableContainer(({
  items, path
}) =>
  <Paper style={{padding: 12}}>
    <List>
      {items.map((value, index) =>
        <SortableItem
          key={index}
          {...{
            value,
            index,
            path
          }}
        />
      )}
    </List>
  </Paper>
)