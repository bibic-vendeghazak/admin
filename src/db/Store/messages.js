import {FEEDBACKS_FS} from "../../lib/firebase"

export function fetchMessageCount() {
  try {
    FEEDBACKS_FS.where("handled", "==", false)
      .onSnapshot(snap =>
        this.setState({unhandledMessageCount: snap.size})
      )
  } catch (error) {
    this.handleSendNotification(error)
  }
}