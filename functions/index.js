var functions = require('firebase-functions');


exports.helloWoridskjld = functions.https.onRequest((request, response) => {
    response.send("Hello from Firebase!");
});