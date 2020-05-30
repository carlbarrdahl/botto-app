const admin = require("firebase-admin")
const config = require("./config")

process.env.NODE_ENV === "development"
  ? admin.initializeApp({
      credential: admin.credential.cert(require("./serviceAccountKey.json")),
      databaseURL: "https://botto-app.firebaseio.com",
    })
  : admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      databaseURL: "https://botto-app.firebaseio.com",
    })

module.exports = {
  config,
  auth: admin.auth(),
  db: admin.database(),
  stripe: require("stripe")(config.stripe.sk),
}
