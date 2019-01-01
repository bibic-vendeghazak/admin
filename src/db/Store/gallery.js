import {GALLERIES_DB} from "../../lib/firebase"
import {routes} from "../../utils"


export function subscribeToGalleries() {
  GALLERIES_DB.child(routes.ROOMS)
    .on("value", snap => {
      this.setState({roomPictures: snap.exists() ? snap.val() : []})
    })
}