import * as admin from "firebase-admin"
import * as firebaseFunctions from "firebase-functions"
import serviceAccount from "../service-account-credentials.json"

export const functions = firebaseFunctions.region("europe-west1")


const firebase = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://bibic-vendeghazak-api.firebaseio.com",
  storageBucket: "bibic-vendeghazak-api.appspot.com"
})

export default firebase

export const firestore = firebase.firestore()
firestore.settings({
  timestampsInSnapshots: true,
})

export const storage = firebase.storage()
export const database = firebase.database()

export const RESERVATIONS_FS = firestore.collection("reservations")
export const ROOMS_DB = database.ref("rooms")
