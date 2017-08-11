const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.sendMessage = functions.https.onRequest((request, response) => {
    // The topic name can be optionally prefixed with "/topics/".
    let topic = request.body.topic;

// See the "Defining the message payload" section below for details
// on how to define a message payload.
    let payload = {
        data: {
            location: request.body.location,
            blood: request.body.blood,
            date: request.body.date
        }
    };
    admin.messaging().sendToTopic(topic, payload)
        .then(function(response) {
            // See the MessagingTopicResponse reference documentation for the
            // contents of response.
            console.log("Successfully sent message:", response);
        })
        .catch(function(error) {
            console.log("Error sending message:", error);
        });
    response.send("Hello from Firebase!");
});
