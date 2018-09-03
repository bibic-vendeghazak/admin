import React from "react"
import PropTypes from "prop-types";
import {Button} from "@material-ui/core"
import Add from "@material-ui/icons/ShortTextRounded"
import {DB} from "../../../utils/firebase"
import {withStore} from "../../App/Store"


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

  let style

  if (relativeFAB) {
    style ={
      position: "relative",
      left: "calc(100% - 16px)",
      transform: "translateX(-100%)",
      bottom: -8
    }
  } else {
    style={
      position: "fixed",
      right: 32,
      bottom: 32
    }
  }

  return (
    <Button
      color="secondary"
      onClick={handleCreateNewParagraph}
      style={style}
      variant="extendedFab"
    >
      <Add/>
      <span style={{marginLeft: 8}}>Új bekezdés</span>
    </Button>

  )
}

NewParagraph.propTypes = {
  sendNotification: PropTypes.func,
  path: PropTypes.string,
  relativeFAB: PropTypes.bool
}

export default withStore(NewParagraph)