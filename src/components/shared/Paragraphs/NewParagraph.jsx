import React from "react"
import {Button} from "@material-ui/core"
import Add from '@material-ui/icons/ShortTextRounded'
import {DB} from "../../../utils/firebase"
import {withStore} from "../../App/Store"


const NewParagraph = ({
  sendNotification, path
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
    <Button
      color="secondary"
      onClick={handleCreateNewParagraph}
      style={{
        position: "fixed",
        right: 32,
        bottom: 32
      }}
      variant="extendedFab"
    >
      <Add/>
      <span style={{marginLeft: 8}}>Új bekezdés</span>
    </Button>

  )
}

export default withStore(NewParagraph)