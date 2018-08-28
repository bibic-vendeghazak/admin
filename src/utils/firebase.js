import firebase from "@firebase/app"
import "@firebase/database"
import "@firebase/firestore"
import "@firebase/auth"
import "@firebase/storage"

firebase.initializeApp({
  apiKey: "AIzaSyB4-Y2_RCdrOouJJxUJkBBXGyj4hNdjDs0",
  authDomain: "bibic-vendeghazak-api.firebaseapp.com",
  databaseURL: "https://bibic-vendeghazak-api.firebaseio.com",
  projectId: "bibic-vendeghazak-api",
  storageBucket: "bibic-vendeghazak-api.appspot.com",
  messagingSenderId: "586582307718"
})

export const FS = firebase.firestore()
FS.settings({timestampsInSnapshots: true})

export const DB = firebase.database()
export const FileStore = firebase.storage()
export const AUTH = firebase.auth()


export const RESERVATIONS_FS = FS.collection("reservations")
export const FEEDBACKS_FS = FS.collection("feedbacks")
export const SPECIAL_REQUESTS_FS = FS.collection("special-requests")
export const GALLERIES_DB = DB.ref("galleries")
export const ADMINS = DB.ref("admins")
export const ROOMS_DB = DB.ref("rooms")
export const FOODS_DB = DB.ref("foods")
export const ROOM_SERVICES_DB = DB.ref("roomServices")
export const SERVICES_DB = DB.ref("services")
export const SERVER_MESSAGE_DB = DB.ref("serverMessage")
export const RESERVATION_DATES_DB = DB.ref("reservationDates")
export const PARAGRAPHS_DB = DB.ref("paragraphs")

export const TIMESTAMP = firebase.firestore.FieldValue.serverTimestamp()

export const getAdminName = uid => ADMINS
  .child(`${uid}/name`)
  .once("value")