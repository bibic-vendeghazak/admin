import React from "react"
import PropTypes from "prop-types"
import {Link} from "react-router-dom"
import {routes, toRoute} from "../../../utils"
import {Paper, Tooltip, Fab} from "@material-ui/core"
import Edit from "@material-ui/icons/EditRounded"

const GalleryItem = ({
  item: {
    key, fileName, SIZE_640, title
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
        src={SIZE_640}
        style={{
          position: "absolute",
          objectFit: "cover",
          width: 140,
          height: 140,
          pointerEvents: "none"
        }}
      />
      <Tooltip title="Szerkesztés">
        <Fab
          component={Link}
          size="small"
          to={toRoute(path, key, routes.EDIT)}
          variant="round"
        >
          <Edit/>
        </Fab>
      </Tooltip>
    </Paper>
  </Tooltip>


GalleryItem.propTypes = {
  item: PropTypes.shape({
    key: PropTypes.string,
    fileName: PropTypes.string,
    SIZE_640: PropTypes.string,
    title: PropTypes.string
  }),
  path: PropTypes.string
}
export default GalleryItem