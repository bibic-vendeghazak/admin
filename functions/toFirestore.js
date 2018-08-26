const admin = require("firebase-admin")
const serviceAccount = require("./service-account-credentials.json")
const feedbacks = require("./data.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  feedbacksbaseURL: "https://bibic-vendeghazak-api.firebaseio.com"
})
admin.firestore().settings({timestampsInSnapshots: true})

feedbacks && Object.keys(feedbacks).forEach(key => {
  const nestedContent = feedbacks[key]

  if (typeof nestedContent === "object") {
    Object.keys(nestedContent).forEach(docTitle => {
      admin.firestore()
        .collection(key)
        .doc(docTitle)
        .set(nestedContent[docTitle])
    })
  }
})