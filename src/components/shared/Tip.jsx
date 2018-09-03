import React from "react"
import PropTypes from "prop-types"

import {Typography, Grid} from "@material-ui/core"

import Help from "@material-ui/icons/HelpRounded"

const Tip = ({children}) =>
  <Grid alignItems="center" container style={{margin: "8px 16px"}}>
    <Help color="disabled"/>
    <Typography
      style={{
        fontFamily: "sans-serif",
        fontStyle: "italic",
        fontSize: 10,
        lineHeight: "10px"
      }}
      variant="subheading"
    >
    Tipp: {children}
    </Typography>
  </Grid>

Tip.propTypes = {children: PropTypes.string}

export default Tip