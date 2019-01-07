import {MESSAGES_FS} from "../../lib/firebase"

export async function fetchMessageCount() {
  try {
    MESSAGES_FS.where("accepted", "==", false)
      .onSnapshot(snap =>
        this.setState({unhandledMessageCount: snap.size})
      )
  } catch (error) {
    this.handleSendNotification(error)
  }
}