import {FEEDBACKS_FS} from "../../lib/firebase"

export function fetchFeedbackCount() {
  try {
    FEEDBACKS_FS.where("handled", "==", false)
      .onSnapshot(snap =>
        this.setState({unhandledFeedbackCount: snap.size})
      )
  } catch (error) {
    this.handleSendNotification(error)
  }
}