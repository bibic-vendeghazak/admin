import React from "react"
import PropTypes from "prop-types"
import {Link} from "react-router-dom"
import {routes, toRoute} from "../../../utils"
import {Button, Paper, Tooltip} from "@material-ui/core"
import Edit from "@material-ui/icons/EditRounded"

const GalleryItem = ({
  item: {
    key, fileName, SIZE_360, title
  }, path
}) =>
  <Tooltip title={title || fileName}>
    <Paper
      elevation={2}
      style={{
        position: "relative",
        cursor: "grabbing	",
        width: 140,
        height: 140,
        overflow: "hidden",
        userSelect: "none",
        display: "grid",
        justifyItems: "center",
        alignItems: "center"
      }}
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
          height: "100%"
        }}
      />
      <Tooltip title="Szerkesztés">
        <Button
          component={Link}
          mini
          to={toRoute(path, key, routes.EDIT)}
          variant="fab"
        >
          <Edit/>
        </Button>
      </Tooltip>
    </Paper>
  </Tooltip>


GalleryItem.propTypes = {
  item: PropTypes.shape({
    key: PropTypes.string,
    fileName: PropTypes.string,
    SIZE_360: PropTypes.string,
    title: PropTypes.string
  }),
  path: PropTypes.string
}
export default GalleryItem