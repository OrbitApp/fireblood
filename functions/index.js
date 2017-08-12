const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.sendMessage = functions.https.onRequest((request, response) => {
    // The topic name can be optionally prefixed with "/topics/".
    let topic = request.query.topic;

// See the "Defining the message payload" section below for details
// on how to define a message payload.
    let payload = {
        data: {
            location: request.query.location,
            blood: request.query.blood,
            date: request.query.date
        }
    };
    admin.database.ref("users").once().then((snapshot) => {
        let users = snapshot.val();
        users.each((user) => {
            //send notification
            user.notificationTokens.each((token) => {
                admin.messaging.sendToDevice(token, payload)
                    .then((response) => {
                        // See the MessagingTopicResponse reference documentation for the
                        // contents of response.

                        console.log("Successfully sent message:", response);
                    })
                    .catch((error) => {
                        console.log("Error sending message:", error);
                    });
            })
        })
    });

    response.send("Hello from Firebase!");
});

exports.userPushNotification = functions.database.ref('/requests/{requestId}')
    .onWrite( () => {
        admin.database.ref("users").once().then((snapshot) => {
            let users = snapshot.val();
            users.each((user) => {
                //send notification
                user.notificationTokens.each((token) => {
                    admin.messaging.sendToDevice(token, payload)
                        .then((response) => console.log("Successfully sent message:", response))
                        .catch((error) => {console.log("Error sending message:", error)
                    });
                })
            })
        });
    });
