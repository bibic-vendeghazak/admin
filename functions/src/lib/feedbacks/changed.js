import { database, firestore, functions } from "../firebase"
import { getRatingAverage } from "./utils"

const FEEDBACKS_FUNC_REF = functions.firestore
  .document("feedbacks/{feedbackId}")

const FEEDBACKS_FS_REF = firestore.collection("feedbacks")
const FEEDBACKS_DB_REF = database.ref("feedbacks")


export const feedbackChanged = FEEDBACKS_FUNC_REF
  .onWrite(async ({before}) => {
    console.log(`feedback ${before.data().id} has been changed, recalculate averages...`)
    const rooms = {}
    const feedbacks = await FEEDBACKS_FS_REF.where("accepted", "==", true).get()

    feedbacks.forEach(feedback => {
      const {roomId, ratings} = feedback.data()
      if (Array.isArray(rooms[roomId])) {
        rooms[roomId].push(getRatingAverage(ratings))
      } else {
        rooms[roomId] = [(getRatingAverage(ratings))]
      }
    })

    const averages = {}
    Object.entries(rooms).forEach(([roomId, room]) =>
      averages[roomId] = room.reduce((acc, rating) => acc + rating) / room.length
    )

    await FEEDBACKS_DB_REF.set(averages)

    return console.log("Feedback averages has been recalculated.")
  })
