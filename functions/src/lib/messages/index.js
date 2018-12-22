import { functions } from "../firebase"
import { sendMessageEmails } from "../email"

const messageRef = functions.firestore
  .document("messages/{messageId}")


export const messageCreated = messageRef
  .onCreate(snap => {
    const message = snap.data()
    console.log(`message ${snap.id} created, now sending emails`)
    return sendMessageEmails(message)
  })