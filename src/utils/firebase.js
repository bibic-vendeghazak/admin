import firebase from "firebase"
import "firebase/firestore"

firebase.initializeApp({
	apiKey: "AIzaSyB4-Y2_RCdrOouJJxUJkBBXGyj4hNdjDs0",
	authDomain: "bibic-vendeghazak-api.firebaseapp.com",
	databaseURL: "https://bibic-vendeghazak-api.firebaseio.com",
	projectId: "bibic-vendeghazak-api",
	storageBucket: "bibic-vendeghazak-api.appspot.com",
	messagingSenderId: "586582307718"
})
const firestore = firebase.firestore()
const settings = {timestampsInSnapshots: true}
firestore.settings(settings)

const DB = firebase.database()
const FS = firebase.firestore()
const AUTH = firebase.auth()



const RESERVATIONS_FS = FS.collection("reservations")
const FEEDBACKS_DB = DB.ref("feedbacks")
const ADMINS = DB.ref("admins")
const ROOMS_DB = DB.ref("rooms")
const ROOM_SERVICES_DB = DB.ref("roomServices")
const SERVER_MESSAGE_DB = DB.ref("serverMessage")

const TIMESTAMP = firebase.firestore.FieldValue.serverTimestamp()


export {DB, FS, AUTH, 
	RESERVATIONS_FS, FEEDBACKS_DB,
	ROOM_SERVICES_DB, ROOMS_DB, SERVER_MESSAGE_DB,
	ADMINS, TIMESTAMP
}