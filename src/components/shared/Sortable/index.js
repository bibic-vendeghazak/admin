import React, {Component, Fragment} from "react"
import PropTypes from 'prop-types'
import {Route, withRouter} from "react-router-dom"
import {arrayMove} from "react-sortable-hoc"
import {DB} from "../../../utils/firebase"
import {toRoute, routes} from "../../../utils"

import {Loading, Tip} from ".."
import Sort from "./Sort"
import {Grid} from "@material-ui/core"

import {withStore} from "../../App/Store"

const orderList = (a, b) => a[1].order - b[1].order

class Sortable extends Component {
  state = {
    list: null,
    isEmpty: false
  }

  componentDidMount() {
    const {
      folder, match: {url}
    } = this.props
    this.fetchList(toRoute(folder, url))
  }


  componentDidUpdate = ({match: {url: oldPath}}) => {
    const {
      folder, match: {url: newPath}
    } = this.props
    if (newPath !== oldPath) {
      this.fetchList(toRoute(folder, newPath))
    }
  }

  fetchList = listRef => {
    DB.ref(listRef)
      .on("value", snap => {
        this.setState({
          isEmpty: !snap.exists(),
          list: snap.exists()
            ? Object.entries(snap.val()).sort(orderList)
            : null
        })
      })
  }

  handleSort = ({
    oldIndex, newIndex
  }) => {
    const {list} = this.state
    const newList = arrayMove(list, oldIndex, newIndex)
    if (list.toString() !== newList.toString()) {
      const {
        folder, match: {url}, sendNotification
      } = this.props
      Promise.all(
        newList.map(([itemId], index) =>
          DB.ref(toRoute(folder, url, itemId))
            .update({order: index})
            .catch(sendNotification)
        )
      )
        .then(() => {
          sendNotification({
            code: "success",
            message: "Sorrend mentve."
          })
        })
        .catch(sendNotification)
    }
  }

  render() {
    const {
      list, isEmpty
    } = this.state
    const {
      history,
      match: {
        path, url
      },
      actionComponent,
      editItemComponent,
      sortableItemComponent,
      folder,
      hasText,
      axis,
      useDragHandle,
      relativeFAB,
      containerProps,
      itemProps
    } = this.props
    return (
      <Fragment>
        <Grid style={{padding: 8}}>
          <Route
            exact
            path={toRoute(path, ":listItemId", routes.EDIT)}
            render={props =>
              <WrappedComponent
                Component={editItemComponent}
                {...{
                  hasText,
                  folder,
                  path,
                  ...props
                }}
              />
            }
          />
          <Route
            path={url}
            render={() =>
              list ?
                <Sort
                  axis={axis || "xy"}
                  component={sortableItemComponent}
                  containerProps={{
                    container: true,
                    spacing: 16,
                    ...containerProps
                  }}
                  distance={48}
                  helperClass="sort-helper"
                  itemProps={itemProps}
                  items={list}
                  onSortEnd={this.handleSort}
                  path={url}
                  useDragHandle={useDragHandle}
                  useWindowAsScrollContainer
                /> :
                <Loading isEmpty={isEmpty}/>
            }
          />
          <Grid>
            <WrappedComponent
              path={url}
              {...{
                history,
                relativeFAB
              }}
              Component={actionComponent}
            />
          </Grid>
        </Grid>
        <Tip>
          A sorrendet &quot;fogd és vidd&quot; módszerrel lehet változtatni.
          A változtatások automatikusan mentésre kerülnek.
        </Tip>
      </Fragment>
    )
  }
}

Sortable.propTypes = {
  folder: PropTypes.string.isRequired,
  match: PropTypes.object.isRequired,
  editItemComponent: PropTypes.func.isRequired,
  sortableItemComponent: PropTypes.func.isRequired,
  actionComponent: PropTypes.func.isRequired,
  sendNotification: PropTypes.func.isRequired
}

export default withRouter(withStore(Sortable))


const WrappedComponent = ({
  Component, ...props
}) => <Component {...props}/>