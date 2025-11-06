const admin = require("firebase-admin");
const serviceAccount = require("./carefever-firebase-adminsdk-fbsvc-e8a84a3da4.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// You can export multiple items like this
module.exports = {
    db,
    admin
};