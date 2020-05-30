const functions = require("firebase-functions")
require("dotenv").config()

const isDev = process.env.NODE_ENV === "development"

module.exports = {
  baseUrl: isDev ? "http://localhost:8000" : "https://botto-app.web.app",
  stripe: {
    // Set using firebase functions:config:set stripe.sk=
    sk: isDev ? process.env.STRIPE_SK : functions.config().stripe.sk,
    endpointSecret: isDev
      ? "whsec_PwcdOcIreLQ3c2RjIS8G3DK0qMiy6fmL"
      : functions.config().stripe.wh_secret,
    currency: "SEK",
    application_fee_amount: 50,
  },
}
