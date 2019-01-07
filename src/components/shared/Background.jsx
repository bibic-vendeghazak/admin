import React from "react"
import PropTypes from "prop-types"


const Background = ({
  color, children
}) =>
  <span
    style={{
      display: "inline-flex",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: "50%",
      width: 28,
      height: 28,
      margin: 2,
      position: "relative",
      backgroundColor: color,
      color: "white"
    }}
  >
    {children}
  </span>

Background.propTypes = {
  color: PropTypes.string,
  children: PropTypes.node
}

export default Background