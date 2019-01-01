import React from "react"
import PropTypes from "prop-types"
import {Fab, Grid} from "@material-ui/core"
import Add from "@material-ui/icons/ShortTextRounded"
import {DB} from "../../../lib/firebase"
import {withStore} from "../../../db"


const NewParagraph = ({
  sendNotification, path, relativeFAB
}) => {
  const handleCreateNewParagraph = () =>
    DB.ref(`paragraphs${path}`)
      .push({
        text: "",
        order: -1
      })
      .then(() => sendNotification({
        code: "success",
        message: "Új bekezdés hozzáadva"
      }))
      .catch(sendNotification)

  return (
    <Grid container justify="flex-end" style={{paddingTop: 8}}>
      <Fab
        color="secondary"
        onClick={handleCreateNewParagraph}
        style={relativeFAB ? null : {
          position: "fixed",
          right: 32,
          bottom: 32
        }}
        variant="extended"
      >
        <Add/>
        <span style={{marginLeft: 8}}>Új bekezdés</span>
      </Fab>
    </Grid>

  )
}

NewParagraph.propTypes = {
  sendNotification: PropTypes.func,
  path: PropTypes.string,
  relativeFAB: PropTypes.bool
}

export default withStore(NewParagraph)