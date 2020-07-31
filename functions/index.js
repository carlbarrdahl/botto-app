const functions = require("firebase-functions")

const config = require("./config")
const context = require("./context")

const connectStripe = require("./src/connectStripe")
const placeOrder = require("./src/placeOrder")
const payOrder = require("./src/payOrder")
const pollPayment = require("./src/pollPayment")
const syncStripeProducts = require("./src/syncStripeProducts")
const stripeWebhook = require("./src/stripeWebhook")
const STATUS_CODES = require("./src/utils/STATUS_CODES")

const app = require("express")()

app.use(require("cors")({ origin: config.baseUrl }))
app.use(require("express-pino-logger")())

async function authMiddleware(req, _, next) {
  try {
    const token = (req.headers.authorization || "").split("Bearer ")[1]

    req.user = await context.auth.verifyIdToken(token)

    next()
  } catch (error) {
    next(error)
  }
}

// Create Shop by connecting Stripe
app.post("/connectStripe", authMiddleware, async (req, res) => {
  req.log.info("Connecting Stripe")

  const { code, state } = req.query

  return connectStripe({ code, state, user: req.user }, context)
    .then(() => res.status(STATUS_CODES.ACCEPTED).send({ success: true }))
    .catch(err =>
      res
        .status(err.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR)
        .send({ error: err.message })
    )
})

// Add Stripe products to database
app.post("/syncProducts", authMiddleware, async (req, res) => {
  req.log.info("Syncing Stripe products")

  return syncStripeProducts({ user: req.user }, context)
    .then(data => res.status(STATUS_CODES.ACCEPTED).send(data))
    .catch(err =>
      res
        .status(err.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR)
        .send({ error: err.message })
    )
})

// Create order
app.post("/placeOrder", authMiddleware, async (req, res) => {
  req.log.info("Placing order")
  const { lineItems, stripeAccount } = req.body
  return placeOrder({ lineItems, stripeAccount, user: req.user }, context)
    .then(order => res.status(201).send(order))
    .catch(err =>
      res
        .status(err.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR)
        .send({ error: err.message })
    )
})
// Create Stripe checkout session
app.post("/payOrder", authMiddleware, async (req, res) => {
  req.log.info("Pay order")

  const { orderId } = req.body

  return payOrder({ orderId, user: req.user }, context)
    .then(session => res.status(STATUS_CODES.CREATED).send(session))
    .catch(err =>
      res
        .status(err.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR)
        .send({ error: err.message })
    )
})

app.post("/pollPayment", authMiddleware, async (req, res) => {
  req.log.info("Poll payment")

  return pollPayment(req.body, context)
    .then(() => res.status(STATUS_CODES.ACCEPTED).send({ status: "ok" }))
    .catch(err =>
      res
        .status(err.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR)
        .send({ error: err.message })
    )
})

// Webhooks from Stripe
app.post(
  "/webhook",
  require("body-parser").raw({ type: "application/json" }),
  (req, res) => {
    return stripeWebhook(
      { payload: req.rawBody, sig: req.headers["stripe-signature"] },
      context
    )
      .then(() => res.json({ received: true }))
      .catch(err => res.status(STATUS_CODES.BAD_REQUEST).send(err.message))
  }
)

app.get("/status", (_, res) => {
  return res
    .status(STATUS_CODES.ACCEPTED)
    .send({ message: "OK", executed: new Date().toISOString() })
})

exports.api = functions.region("europe-west1").https.onRequest(app)

// Create Stripe customer + User
// exports.onCreateUser = functions.region("europe-west1").auth.user().onCreate(({ email, uid }) =>
//   context.stripe.customers
//     .create({ email })
//     .then(customer =>
//       context.db
//         .ref(`users/${uid}`)
//         .set({ uid, email, customer_id: customer.id })
//     )
//     .catch(console.error)
// )
