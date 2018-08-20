import React from 'react'

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
      position: "relative",
      backgroundColor: color,
      color: "white"
    }}
  >
    {children}
  </span>


export default Background