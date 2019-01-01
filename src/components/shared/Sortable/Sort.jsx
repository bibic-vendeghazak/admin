import React from "react"
import {SortableContainer, SortableElement} from "react-sortable-hoc"
import {ListSubheader, Grid} from "@material-ui/core"

const SortableItem = SortableElement(
  ({Component, itemProps, ...props}) =>
    <Grid item>
      <Component {...{itemProps, ...props}}/>
    </Grid>
)

const Sort = SortableContainer(({
  containerProps, itemProps, items, path, component, title
}) =>
  <Grid {...containerProps}>
    {title && <ListSubheader>{title}</ListSubheader>}
    {items.map(([key, values], index) =>
      <SortableItem
        Component={component}
        item={{key, ...values}}
        key={key}
        {...{itemProps, path, index}}
      />
    )}
  </Grid>
)

export default Sort