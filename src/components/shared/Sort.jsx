import React from "react"
import {SortableContainer, SortableElement} from "react-sortable-hoc"
import {ListSubheader, Grid} from "@material-ui/core"

const SortableItem = SortableElement(({
  Component, ...props
}) => <Grid item><Component {...props}/></Grid>)

const Sort = SortableContainer(({
  containerStyle, items, path, component, title
}) =>
  <Grid container {...containerStyle}>
    {title && <ListSubheader>{title}</ListSubheader>}
    {items.map(([key, values], index) =>
      <SortableItem
        Component={component}
        index={index}
        item={{
          key,
          ...values
        }}
        key={key}
        path={path}
      />
    )}
  </Grid>
)

export default Sort